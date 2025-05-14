
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, AlertTriangle, Info, CalendarDays, Lightbulb } from 'lucide-react';
import { suggestFeatures } from '@/ai/flows/suggest-features';
import type { SuggestFeaturesOutput, FeatureDetail } from '@/ai/flows/suggest-features';
import { suggestDevPlan } from '@/ai/flows/suggest-dev-plan';
import type { SuggestDevPlanOutput, DevPlanPhase } from '@/ai/flows/suggest-dev-plan';
import FeatureCard from '@/components/feature-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function FeatureForm() {
  const [appDescription, setAppDescription] = useState<string>('');
  const [features, setFeatures] = useState<FeatureDetail[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState<boolean>(false);
  const [featuresError, setFeaturesError] = useState<string | null>(null);
  const [showInitialMessage, setShowInitialMessage] = useState<boolean>(true);

  const [devPlan, setDevPlan] = useState<SuggestDevPlanOutput | null>(null);
  const [isLoadingDevPlan, setIsLoadingDevPlan] = useState<boolean>(false);
  const [devPlanError, setDevPlanError] = useState<string | null>(null);

  const handleFeatureSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!appDescription.trim()) {
      setFeaturesError("Please enter an app description.");
      return;
    }

    setIsLoadingFeatures(true);
    setFeaturesError(null);
    setFeatures([]);
    setShowInitialMessage(false);
    setDevPlan(null); // Reset dev plan if generating new features
    setDevPlanError(null);


    try {
      const result: SuggestFeaturesOutput = await suggestFeatures({ appDescription });
      if (result.features && result.features.length > 0) {
        setFeatures(result.features);
      } else {
        setFeaturesError("No features were suggested. Try refining your description.");
      }
    } catch (e) {
      console.error(e);
      setFeaturesError("An error occurred while generating features. Please try again.");
    } finally {
      setIsLoadingFeatures(false);
    }
  };

  const handleGenerateDevPlan = async () => {
    if (features.length === 0 || !appDescription) {
      setDevPlanError("Please generate features first and ensure an app description is provided.");
      return;
    }
    setIsLoadingDevPlan(true);
    setDevPlanError(null);
    setDevPlan(null);

    try {
      const result: SuggestDevPlanOutput = await suggestDevPlan({ appDescription, features });
      setDevPlan(result);
    } catch (e) {
      console.error(e);
      setDevPlanError("An error occurred while generating the development plan. Please try again.");
    } finally {
      setIsLoadingDevPlan(false);
    }
  };


  useEffect(() => {
    // Placeholder for any client-side specific initializations
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleFeatureSubmit} className="space-y-6 mb-12">
        <div>
          <Textarea
            value={appDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAppDescription(e.target.value)}
            placeholder="e.g., A mobile app for tracking personal fitness goals with AI-powered meal suggestions..."
            rows={5}
            className="text-base border-input focus:ring-accent focus:border-accent shadow-sm"
            disabled={isLoadingFeatures || isLoadingDevPlan}
          />
        </div>
        <div>
          <Button 
            type="submit" 
            disabled={isLoadingFeatures || isLoadingDevPlan} 
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring"
          >
            {isLoadingFeatures ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Features...
              </>
            ) : (
              'Generate Features'
            )}
          </Button>
        </div>
      </form>

      {featuresError && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Feature Generation Error</AlertTitle>
          <AlertDescription>{featuresError}</AlertDescription>
        </Alert>
      )}

      {showInitialMessage && !isLoadingFeatures && !featuresError && features.length === 0 && (
         <Alert className="mb-8 text-center bg-secondary border-secondary-foreground/10 animate-in fade-in-0">
          <Info className="h-5 w-5 inline-block mr-2 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            Enter your app description above and click 'Generate Features' to see suggestions.
          </AlertDescription>
        </Alert>
      )}
      
      {!showInitialMessage && !isLoadingFeatures && !featuresError && features.length === 0 && (
         <Alert className="mb-8 text-center bg-secondary border-secondary-foreground/10 animate-in fade-in-0">
          <Info className="h-5 w-5 inline-block mr-2 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            No features suggested for the current description. Try to be more specific or broad in your request.
          </AlertDescription>
        </Alert>
      )}


      {features.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">Suggested Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((featureItem, index) => (
              <FeatureCard feature={featureItem} index={index} key={index} />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              onClick={handleGenerateDevPlan} 
              disabled={isLoadingFeatures || isLoadingDevPlan || features.length === 0}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              {isLoadingDevPlan ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Plan...
                </>
              ) : (
                <>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Generate Development Plan & Calendar
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {devPlanError && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Development Plan Error</AlertTitle>
          <AlertDescription>{devPlanError}</AlertDescription>
        </Alert>
      )}

      {isLoadingDevPlan && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto" />
          <p className="mt-4 text-muted-foreground">Crafting your development plan...</p>
        </div>
      )}

      {devPlan && !isLoadingDevPlan && !devPlanError && (
        <Card className="w-full shadow-xl animate-in fade-in-0 slide-in-from-bottom-5">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Development Plan: {devPlan.projectName}
            </CardTitle>
            <p className="text-center text-muted-foreground pt-1">{devPlan.executiveSummary}</p>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
            <div>
              <h4 className="text-xl font-semibold mb-3 text-foreground">Development Phases</h4>
              {devPlan.phases.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {devPlan.phases.map((phase, index) => (
                    <AccordionItem value={`phase-${index}`} key={index} className="border-border">
                      <AccordionTrigger className="text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                           <span className="text-accent font-semibold">{phase.phaseTitle}</span> 
                           <span className="text-sm text-muted-foreground">({phase.estimatedDuration})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-1 space-y-3">
                        <p className="text-sm text-foreground font-medium">{phase.phaseGoal}</p>
                        <p className="text-sm text-muted-foreground">Features to implement:</p>
                        <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-muted-foreground">
                          {phase.featuresToImplement.map((featureName, idx) => (
                            <li key={idx}>{featureName}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">No specific phases outlined by the AI.</p>
              )}
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Overall Estimated Timeline</h4>
              <p className="text-muted-foreground">{devPlan.overallTimeline}</p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-3 text-foreground flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-accent"/>
                Key Recommendations
              </h4>
              {devPlan.recommendations.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {devPlan.recommendations.map((rec, index) => (
                    <li key={index} className="pl-2">{rec}</li>
                  ))}
                </ul>
              ) : (
                 <p className="text-muted-foreground">No specific recommendations provided by the AI.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
