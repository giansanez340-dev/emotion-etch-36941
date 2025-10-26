import { useState } from "react";
import { Header } from "@/components/Header";
import { TextInputArea } from "@/components/TextInputArea";
import { ToneEmotionMeter } from "@/components/ToneEmotionMeter";
import { SentencePreview } from "@/components/SentencePreview";
import { ExplanationDialog } from "@/components/ExplanationDialog";

// Mock analysis function - in a real app, this would call an AI API
function analyzeText(text: string) {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  
  // Simple keyword-based analysis for demo
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy', 'success', 'beautiful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'frustrated', 'disappointed', 'fail', 'problem'];
  const neutralWords = ['the', 'and', 'or', 'but', 'with', 'for', 'in', 'on', 'at', 'by'];

  let positiveCount = 0;
  let negativeCount = 0;
  
  const analyzedWords = text.split(/(\s+)/).map((segment, index) => {
    const word = segment.toLowerCase().replace(/[^\w]/g, '');
    
    if (positiveWords.includes(word)) {
      positiveCount++;
      return {
        word: segment,
        tone: 'positive' as const,
        emotion: 'happy',
        isHighlighted: true
      };
    } else if (negativeWords.includes(word)) {
      negativeCount++;
      return {
        word: segment,
        tone: 'negative' as const,
        emotion: 'sad',
        isHighlighted: true
      };
    } else if (word.length > 3 && !neutralWords.includes(word)) {
      return {
        word: segment,
        tone: 'neutral' as const,
        emotion: 'calm',
        isHighlighted: Math.random() > 0.7 // Randomly highlight some neutral words
      };
    }
    
    return {
      word: segment,
      isHighlighted: false
    };
  });

  // Determine overall tone
  const totalSentimentWords = positiveCount + negativeCount;
  let overallTone: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 50;

  if (totalSentimentWords > 0) {
    if (positiveCount > negativeCount) {
      overallTone = 'positive';
      confidence = Math.min(90, 60 + (positiveCount / totalSentimentWords) * 30);
    } else if (negativeCount > positiveCount) {
      overallTone = 'negative';
      confidence = Math.min(90, 60 + (negativeCount / totalSentimentWords) * 30);
    } else {
      confidence = 70;
    }
  }

  // Determine primary emotion
  const emotions = ['happy', 'calm', 'excited', 'neutral'];
  const primaryEmotion = overallTone === 'positive' ? 'happy' : 
                        overallTone === 'negative' ? 'sad' : 'calm';

  return {
    tone: { type: overallTone, confidence },
    emotion: { type: primaryEmotion, confidence: confidence - 10 },
    analyzedWords: analyzedWords.filter(w => w.word.trim().length > 0)
  };
}

const Index = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. This is an amazing example!");
  const [showExplanation, setShowExplanation] = useState(false);

  const analysis = text.trim() ? analyzeText(text) : {
    tone: { type: 'neutral' as const, confidence: 0 },
    emotion: { type: 'neutral', confidence: 0 },
    analyzedWords: []
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <TextInputArea text={text} onChange={setText} />
            
            {text.trim() && (
              <SentencePreview 
                analyzedWords={analysis.analyzedWords}
                onExplain={() => setShowExplanation(true)}
              />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {text.trim() && (
              <ToneEmotionMeter 
                tone={analysis.tone}
                emotion={analysis.emotion}
              />
            )}
          </div>
        </div>
      </div>

      <ExplanationDialog
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        tone={analysis.tone}
        emotion={analysis.emotion}
      />
    </div>
  );
};

export default Index;
