
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, AlertTriangle, Info, CalendarDays, Lightbulb, FileJson, FileText, Download, Sparkles } from 'lucide-react'; // Added Sparkles
import { suggestFeatures } from '@/ai/flows/suggest-features';
import type { SuggestFeaturesOutput, FeatureDetail } from '@/ai/flows/suggest-features';
import { suggestDevPlan } from '@/ai/flows/suggest-dev-plan';
import type { SuggestDevPlanOutput, DevPlanPhase as OriginalDevPlanPhase } from '@/ai/flows/suggest-dev-plan'; // Renamed to avoid conflict
import FeatureCard from '@/components/feature-card';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Separator } from './ui/separator';

// Define local type for DevPlanPhase including genkitPromptSuggestions
interface GenkitPromptSuggestion {
  featureName: string;
  suggestedPrompt: string;
}
interface DevPlanPhase extends OriginalDevPlanPhase {
  genkitPromptSuggestions?: GenkitPromptSuggestion[];
}
interface ExtendedSuggestDevPlanOutput extends Omit<SuggestDevPlanOutput, 'phases'> {
  phases: DevPlanPhase[];
}


export default function FeatureForm() {
  const [appDescription, setAppDescription] = useState<string>('');
  const [features, setFeatures] = useState<FeatureDetail[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState<boolean>(false);
  const [featuresError, setFeaturesError] = useState<string | null>(null);
  const [showInitialMessage, setShowInitialMessage] = useState<boolean>(true);

  const [devPlan, setDevPlan] = useState<ExtendedSuggestDevPlanOutput | null>(null);
  const [isLoadingDevPlan, setIsLoadingDevPlan] = useState<boolean>(false);
  const [devPlanError, setDevPlanError] = useState<string | null>(null);

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    setDevPlan(null); 
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
      // Cast to ExtendedSuggestDevPlanOutput to satisfy TypeScript
      const result = await suggestDevPlan({ appDescription, features }) as ExtendedSuggestDevPlanOutput;
      setDevPlan(result);
    } catch (e) {
      console.error(e);
      setDevPlanError("An error occurred while generating the development plan. Please try again.");
    } finally {
      setIsLoadingDevPlan(false);
    }
  };

  // Export Features
  const handleExportFeaturesAsJSON = () => {
    if (!features.length) return;
    const jsonData = JSON.stringify(features, null, 2);
    downloadFile(`${devPlan?.projectName.replace(/\s+/g, '-').toLowerCase() || 'app'}-features.json`, jsonData, 'application/json');
  };

  const handleExportFeaturesAsMarkdown = () => {
    if (!features.length) return;
    let mdData = `# Suggested Features for "${appDescription.substring(0, 50)}${appDescription.length > 50 ? '...' : ''}"\n\n`;
    mdData += `Based on your description: "${appDescription}"\n\n---\n\n`;
    features.forEach(feature => {
      mdData += `## ${feature.name}\n`;
      mdData += `**Description:** ${feature.description}\n`;
      mdData += `**Category:** ${feature.category}\n`;
      mdData += `**Complexity:** ${feature.complexity}\n\n---\n\n`;
    });
    downloadFile(`${devPlan?.projectName.replace(/\s+/g, '-').toLowerCase() || 'app'}-features.md`, mdData, 'text/markdown');
  };

  // Export Dev Plan
  const handleExportDevPlanAsJSON = () => {
    if (!devPlan) return;
    const jsonData = JSON.stringify(devPlan, null, 2);
    downloadFile(`${devPlan.projectName.replace(/\s+/g, '-').toLowerCase()}-dev-plan.json`, jsonData, 'application/json');
  };

  const handleExportDevPlanAsMarkdown = () => {
    if (!devPlan) return;
    let mdData = `# Development Plan: ${devPlan.projectName}\n\n`;
    mdData += `**Based on App Description:** ${appDescription}\n\n`;
    mdData += `## Executive Summary\n${devPlan.executiveSummary}\n\n---\n\n`;
    mdData += `## Development Phases\n`;
    devPlan.phases.forEach(phase => {
      mdData += `### ${phase.phaseTitle}\n`;
      mdData += `**Goal:** ${phase.phaseGoal}\n`;
      mdData += `**Estimated Duration:** ${phase.estimatedDuration}\n`;
      mdData += `**Features to Implement:**\n${phase.featuresToImplement.map(f => `- ${f}`).join('\n')}\n`;
      if (phase.genkitPromptSuggestions && phase.genkitPromptSuggestions.length > 0) {
        mdData += `\n**💡 Genkit Prompt Ideas:**\n`;
        phase.genkitPromptSuggestions.forEach(suggestion => {
          mdData += `  - **For Feature "${suggestion.featureName}":** \`${suggestion.suggestedPrompt}\`\n`;
        });
      }
      mdData += `\n`;
    });
    mdData += `---\n\n## Overall Estimated Timeline\n${devPlan.overallTimeline}\n\n---\n\n`;
    mdData += `## Key Recommendations\n${devPlan.recommendations.map(rec => `- ${rec}`).join('\n')}\n`;
    downloadFile(`${devPlan.projectName.replace(/\s+/g, '-').toLowerCase()}-dev-plan.md`, mdData, 'text/markdown');
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

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-center items-center gap-4">
             <h4 className="text-md font-medium text-muted-foreground mb-2 sm:mb-0">Export Features:</h4>
            <Button 
              onClick={handleExportFeaturesAsJSON} 
              variant="outline"
              size="sm"
              disabled={isLoadingFeatures || isLoadingDevPlan || features.length === 0}
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportFeaturesAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={isLoadingFeatures || isLoadingDevPlan || features.length === 0}
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
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
        <Card className="w-full shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 mb-12">
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
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Features to implement:</p>
                          <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-muted-foreground">
                            {phase.featuresToImplement.map((featureName, idx) => (
                              <li key={idx}>{featureName}</li>
                            ))}
                          </ul>
                        </div>
                        {phase.genkitPromptSuggestions && phase.genkitPromptSuggestions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-dashed border-border/70">
                            <h5 className="text-sm text-foreground font-semibold mb-2 flex items-center">
                              <Sparkles className="h-4 w-4 mr-2 text-primary" />
                              Genkit Prompt Ideas:
                            </h5>
                            <ul className="space-y-2">
                              {phase.genkitPromptSuggestions.map((suggestion, idx) => (
                                <li key={idx} className="text-xs">
                                  <p className="text-muted-foreground mb-0.5">
                                    For Feature: <strong className="text-foreground/90">{suggestion.featureName}</strong>
                                  </p>
                                  <code className="block bg-muted/70 p-2 rounded-md text-foreground whitespace-pre-wrap text-[0.7rem] leading-relaxed">
                                    {suggestion.suggestedPrompt}
                                  </code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
          <CardFooter className="flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-border">
            <h4 className="text-md font-medium text-muted-foreground mb-2 sm:mb-0">Export Plan:</h4>
            <Button 
              onClick={handleExportDevPlanAsJSON} 
              variant="outline"
              size="sm"
              disabled={isLoadingFeatures || isLoadingDevPlan || !devPlan}
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportDevPlanAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={isLoadingFeatures || isLoadingDevPlan || !devPlan}
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

