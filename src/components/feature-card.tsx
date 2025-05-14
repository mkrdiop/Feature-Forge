
import type { FeatureDetail } from "@/ai/flows/suggest-features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Layers, Zap } from "lucide-react"; // Example icons

interface FeatureCardProps {
  feature: FeatureDetail;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes("ai")) return <Zap className="h-5 w-5 text-accent" />;
    if (category.toLowerCase().includes("ui") || category.toLowerCase().includes("interface")) return <Lightbulb className="h-5 w-5 text-accent" />;
    return <Layers className="h-5 w-5 text-accent" />; // Default icon
  };

  return (
    <Card 
      className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col"
      style={{ animationDuration: '500ms', animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start gap-3">
            {getCategoryIcon(feature.category)}
            <CardTitle className="text-lg font-semibold text-foreground leading-tight mt-0.5">
            {feature.name}
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-3 flex-grow flex flex-col justify-between">
        <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]"> {/* Ensures minimum height for description */}
          {feature.description}
        </p>
        <div className="flex flex-wrap gap-2 items-center pt-3 mt-auto">
          <Badge variant="outline" className="text-xs py-1 px-2.5">
            <span className="font-medium mr-1.5">Category:</span> {feature.category}
          </Badge>
          <Badge 
            variant={
              feature.complexity === 'Low' ? 'default' : 
              feature.complexity === 'Medium' ? 'secondary' : 
              'destructive'
            } 
            className="text-xs py-1 px-2.5"
          >
            <span className="font-medium mr-1.5">Complexity:</span> {feature.complexity}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
