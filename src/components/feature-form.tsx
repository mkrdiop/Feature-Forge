"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import { suggestFeatures } from '@/ai/flows/suggest-features';
import type { SuggestFeaturesOutput } from '@/ai/flows/suggest-features';
import FeatureCard from '@/components/feature-card';

export default function FeatureForm() {
  const [appDescription, setAppDescription] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInitialMessage, setShowInitialMessage] = useState<boolean>(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!appDescription.trim()) {
      setError("Please enter an app description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeatures([]);
    setShowInitialMessage(false);

    try {
      const result: SuggestFeaturesOutput = await suggestFeatures({ appDescription });
      if (result.features && result.features.length > 0) {
        setFeatures(result.features);
      } else {
        setError("No features were suggested. Try refining your description.");
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while generating features. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle client-side only logic if needed, e.g. focus
  useEffect(() => {
    // Placeholder for any client-side specific initializations
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 mb-12">
        <div>
          <Textarea
            value={appDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAppDescription(e.target.value)}
            placeholder="e.g., A mobile app for tracking personal fitness goals with AI-powered meal suggestions..."
            rows={5}
            className="text-base border-input focus:ring-accent focus:border-accent shadow-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Features'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showInitialMessage && !isLoading && !error && features.length === 0 && (
         <Alert className="mb-8 text-center bg-secondary border-secondary-foreground/10 animate-in fade-in-0">
          <Info className="h-5 w-5 inline-block mr-2 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            Enter your app description above and click 'Generate Features' to see suggestions.
          </AlertDescription>
        </Alert>
      )}
      
      {!showInitialMessage && !isLoading && !error && features.length === 0 && (
         <Alert className="mb-8 text-center bg-secondary border-secondary-foreground/10 animate-in fade-in-0">
          <Info className="h-5 w-5 inline-block mr-2 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            No features suggested for the current description. Try to be more specific or broad in your request.
          </AlertDescription>
        </Alert>
      )}


      {features.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">Suggested Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard feature={feature} index={index} key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
