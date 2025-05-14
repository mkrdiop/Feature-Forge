
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, FileText, Users, DollarSign, SearchCheck, FileSpreadsheet, CalendarDays, Cpu, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  lastUpdated: string;
  description: string;
  assetCounts: {
    features: number;
    personas: number;
    devPlans: number;
    monetization: number;
    problemSolution: number;
    leanCanvas: number;
  };
}

interface ProjectCardProps {
  project: Project;
}

const AssetIcon = ({ type, count }: { type: string, count: number }) => {
  if (count === 0) return null;
  
  const commonClass = "h-3 w-3 mr-1";
  let icon = <BarChart3 className={commonClass} />; // Default
  let tooltip = "";

  switch(type) {
    case 'features': icon = <FileText className={commonClass} />; tooltip="Features"; break;
    case 'personas': icon = <Users className={commonClass} />; tooltip="Personas"; break;
    case 'devPlans': icon = <CalendarDays className={commonClass} />; tooltip="Dev Plans"; break;
    case 'monetization': icon = <DollarSign className={commonClass} />; tooltip="Monetization"; break;
    case 'problemSolution': icon = <SearchCheck className={commonClass} />; tooltip="P/S Fit"; break;
    case 'leanCanvas': icon = <FileSpreadsheet className={commonClass} />; tooltip="Lean Canvas"; break;
  }

  return (
    <Badge variant="secondary" className="text-xs py-0.5 px-1.5 flex items-center" title={`${count} ${tooltip}`}>
      {icon} {count}
    </Badge>
  );
};


export default function ProjectCard({ project }: ProjectCardProps) {
  const { name, lastUpdated, description, assetCounts } = project;

  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground leading-tight">{name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Last updated: {new Date(lastUpdated).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
          {description}
        </p>
        <div className="pt-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Generated Assets:</h4>
          {Object.values(assetCounts).every(count => count === 0) ? (
             <p className="text-xs text-muted-foreground italic">No assets generated yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <AssetIcon type="features" count={assetCounts.features} />
              <AssetIcon type="personas" count={assetCounts.personas} />
              <AssetIcon type="devPlans" count={assetCounts.devPlans} />
              <AssetIcon type="monetization" count={assetCounts.monetization} />
              <AssetIcon type="problemSolution" count={assetCounts.problemSolution} />
              <AssetIcon type="leanCanvas" count={assetCounts.leanCanvas} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4 mt-auto flex justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          {/* This would ideally link to a page showing this project's details */}
          <Link href={`/`}> 
            <Eye className="mr-1.5 h-4 w-4" /> View / Edit
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
