import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface FeatureCardProps {
  feature: string;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <Card 
      className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in-0 slide-in-from-bottom-4"
      style={{ animationDuration: '500ms', animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      <CardHeader className="flex flex-row items-start space-x-3 pb-3 pt-5 px-5">
        <Sparkles className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
        <CardTitle className="text-lg font-medium text-foreground leading-tight">
          Feature Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-sm text-muted-foreground">{feature}</p>
      </CardContent>
    </Card>
  );
}
