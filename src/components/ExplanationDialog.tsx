import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tone: {
    type: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  emotion: {
    type: string;
    confidence: number;
  };
}

export function ExplanationDialog({ isOpen, onClose, tone, emotion }: ExplanationDialogProps) {
  const getToneExplanation = (toneType: string) => {
    switch (toneType) {
      case 'positive':
        return "The text contains uplifting language, optimistic phrases, or words that convey enthusiasm and positivity.";
      case 'negative':
        return "The text includes words or phrases that express criticism, sadness, anger, or other negative sentiments.";
      default:
        return "The text maintains a balanced or factual tone without strong emotional indicators in either direction.";
    }
  };

  const getEmotionExplanation = (emotionType: string) => {
    switch (emotionType.toLowerCase()) {
      case 'happy':
        return "Words indicating joy, contentment, or satisfaction were detected.";
      case 'sad':
        return "Language expressing sorrow, disappointment, or melancholy was identified.";
      case 'angry':
        return "Aggressive or frustrated language patterns were found.";
      case 'excited':
        return "High-energy, enthusiastic expressions were detected.";
      case 'calm':
        return "Peaceful, serene, or tranquil language was identified.";
      default:
        return "The emotional content appears balanced without strong indicators of specific emotions.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Analysis Explanation
          </DialogTitle>
          <DialogDescription>
            Here's why we detected this tone and emotion in your text.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">Tone:</h4>
              <Badge variant={tone.type === 'positive' ? 'default' : 'secondary'}>
                {tone.type.charAt(0).toUpperCase() + tone.type.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {getToneExplanation(tone.type)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">Emotion:</h4>
              <Badge variant="outline">
                {emotion.type.charAt(0).toUpperCase() + emotion.type.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {getEmotionExplanation(emotion.type)}
            </p>
          </div>

          <div className="bg-accent/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> This analysis is based on language patterns and context. 
              Results may vary depending on cultural context and individual interpretation.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}