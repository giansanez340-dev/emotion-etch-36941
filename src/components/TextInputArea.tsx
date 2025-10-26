import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TextInputAreaProps {
  text: string;
  onChange: (text: string) => void;
}

export function TextInputArea({ text, onChange }: TextInputAreaProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Text Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter or paste your text here for tone and emotion analysis..."
          className="min-h-32 resize-none border-border focus:ring-primary"
          maxLength={500}
        />
        <p className="text-sm text-muted-foreground mt-2">
          {text.length}/500 characters
        </p>
      </CardContent>
    </Card>
  );
}