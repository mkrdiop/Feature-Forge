
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Users, DollarSign, SearchCheck, FileSpreadsheet, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '@/components/project-card'; // We will create this component

// Mock data for projects
const mockProjects = [
  {
    id: '1',
    name: 'AI Powered Recipe App',
    lastUpdated: '2024-07-28',
    description: 'A mobile app that suggests recipes based on available ingredients and user preferences, using AI.',
    assetCounts: {
      features: 12,
      personas: 3,
      devPlans: 2, // Standard and AI-Accelerated
      monetization: 3,
      problemSolution: 1,
      leanCanvas: 1,
    },
  },
  {
    id: '2',
    name: 'Freelancer Project Hub',
    lastUpdated: '2024-07-25',
    description: 'A web platform for freelancers to find projects, manage clients, and handle invoicing.',
     assetCounts: {
      features: 15,
      personas: 2,
      devPlans: 1,
      monetization: 2,
      problemSolution: 1,
      leanCanvas: 0, // Example where not all assets are generated
    },
  },
  {
    id: '3',
    name: 'Eco-Friendly Travel Planner',
    lastUpdated: '2024-07-22',
    description: 'An application to help users plan sustainable travel, focusing on eco-friendly accommodations and transport.',
    assetCounts: {
      features: 10,
      personas: 4,
      devPlans: 2,
      monetization: 2,
      problemSolution: 1,
      leanCanvas: 1,
    },
  },
    {
    id: '4',
    name: 'Language Learning Gamification',
    lastUpdated: '2024-07-20',
    description: 'A mobile app that makes learning new languages fun through interactive games and challenges.',
    assetCounts: {
      features: 18,
      personas: 3,
      devPlans: 2,
      monetization: 4,
      problemSolution: 1,
      leanCanvas: 1,
    },
  },
];


export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Projects</h1>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Project
            </Link>
          </Button>
        </div>
         <p className="mt-2 text-muted-foreground">
          Manage your app ideas and generated strategic assets.
        </p>
      </header>

      {mockProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderKanban className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating a new project to generate features and strategic plans for your app ideas.
          </p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Project
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
