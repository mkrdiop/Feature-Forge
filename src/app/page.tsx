import { BrainCircuit } from 'lucide-react';
import FeatureForm from '@/components/feature-form';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 sm:py-6 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-accent" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Feature Forge</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <section className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight mb-3 sm:mb-4">
            Unleash Your App's Potential
          </h2>
          <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your web or mobile app idea, and let our AI craft a list of innovative features, from simple building blocks to cutting-edge AI capabilities.
          </p>
        </section>
        
        <FeatureForm />
      </main>

      <footer className="py-6 border-t border-border mt-auto bg-secondary/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Feature Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
