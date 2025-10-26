import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface AnalyzedWord {
  word: string;
  tone?: 'positive' | 'negative' | 'neutral';
  emotion?: string;
  isHighlighted: boolean;
}

interface SentencePreviewProps {
  analyzedWords: AnalyzedWord[];
  onExplain: () => void;
}

export function SentencePreview({ analyzedWords, onExplain }: SentencePreviewProps) {
  const getWordClassName = (word: AnalyzedWord) => {
    if (!word.isHighlighted) return 'text-foreground';
    
    switch (word.tone) {
      case 'positive':
        return 'bg-positive/20 text-positive border-b-2 border-positive px-1 rounded-sm font-medium';
      case 'negative':
        return 'bg-negative/20 text-negative border-b-2 border-negative px-1 rounded-sm font-medium';
      case 'neutral':
        return 'bg-neutral/20 text-neutral-foreground border-b-2 border-neutral px-1 rounded-sm font-medium';
      default:
        return 'bg-accent text-accent-foreground px-1 rounded-sm font-medium';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg text-foreground">Analysis Preview</CardTitle>
        <Button 
          onClick={onExplain} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          Explain
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-base leading-relaxed">
          {analyzedWords.map((word, index) => (
            <span
              key={index}
              className={`${getWordClassName(word)} transition-colors duration-200 hover:opacity-80 cursor-default`}
              title={word.isHighlighted ? `Tone: ${word.tone}, Emotion: ${word.emotion}` : ''}
            >
              {word.word}
              {index < analyzedWords.length - 1 && ' '}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-positive/20 border-positive border rounded-sm"></div>
            <span className="text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-negative/20 border-negative border rounded-sm"></div>
            <span className="text-muted-foreground">Negative</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-neutral/20 border-neutral border rounded-sm"></div>
            <span className="text-muted-foreground">Neutral</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}