import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ToneEmotionMeterProps {
  tone: {
    type: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  emotion: {
    type: string;
    confidence: number;
  };
}

export function ToneEmotionMeter({ tone, emotion }: ToneEmotionMeterProps) {
  const getToneColor = (toneType: string) => {
    switch (toneType) {
      case 'positive':
        return 'bg-positive text-positive-foreground';
      case 'negative':
        return 'bg-negative text-negative-foreground';
      default:
        return 'bg-neutral text-neutral-foreground';
    }
  };

  const getProgressColor = (toneType: string) => {
    switch (toneType) {
      case 'positive':
        return 'bg-positive';
      case 'negative':
        return 'bg-negative';
      default:
        return 'bg-neutral';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Tone Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Overall Tone</span>
            <Badge className={getToneColor(tone.type)}>
              {tone.type.charAt(0).toUpperCase() + tone.type.slice(1)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">{Math.round(tone.confidence)}%</span>
            </div>
            <Progress 
              value={tone.confidence} 
              className="h-2"
              // Custom progress styling based on tone
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Emotion Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Primary Emotion</span>
            <Badge variant="secondary">
              {emotion.type.charAt(0).toUpperCase() + emotion.type.slice(1)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">{Math.round(emotion.confidence)}%</span>
            </div>
            <Progress 
              value={emotion.confidence} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}