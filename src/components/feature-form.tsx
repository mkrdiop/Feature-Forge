
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, AlertTriangle, Info, CalendarDays, Lightbulb, FileJson, FileText, Download, Sparkles, Cpu } from 'lucide-react'; // Added Sparkles, Cpu
import { suggestFeatures } from '@/ai/flows/suggest-features';
import type { SuggestFeaturesOutput, FeatureDetail } from '@/ai/flows/suggest-features';
import { suggestDevPlan } from '@/ai/flows/suggest-dev-plan';
import type { SuggestDevPlanOutput, DevPlanPhase as OriginalDevPlanPhase } from '@/ai/flows/suggest-dev-plan';
import { suggestAiAcceleratedDevPlan } from '@/ai/flows/suggest-ai-accelerated-dev-plan'; // New import
import type { SuggestAiAcceleratedDevPlanOutput, AiAcceleratedDevPlanPhase as OriginalAiDevPlanPhase } from '@/ai/flows/suggest-ai-accelerated-dev-plan'; // New import

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

// Define local types for AI Accelerated Dev Plan
interface AiAcceleratedFeatureImplementation {
  featureName: string;
  aiDevelopmentNotes: string;
  suggestedCodingAssistantPrompt: string;
}
interface AiAcceleratedDevPlanPhase extends Omit<OriginalAiDevPlanPhase, 'featuresToImplement'> {
  featuresToImplement: AiAcceleratedFeatureImplementation[];
}
interface ExtendedSuggestAiAcceleratedDevPlanOutput extends Omit<SuggestAiAcceleratedDevPlanOutput, 'phases'> {
  phases: AiAcceleratedDevPlanPhase[];
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

  const [aiDevPlan, setAiDevPlan] = useState<ExtendedSuggestAiAcceleratedDevPlanOutput | null>(null);
  const [isLoadingAiDevPlan, setIsLoadingAiDevPlan] = useState<boolean>(false);
  const [aiDevPlanError, setAiDevPlanError] = useState<string | null>(null);


  const sanitizeFilename = (name: string) => {
    return name.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

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
    setAiDevPlan(null);
    setAiDevPlanError(null);


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
    setAiDevPlan(null); // Reset AI dev plan if regenerating standard plan
    setAiDevPlanError(null);

    try {
      const result = await suggestDevPlan({ appDescription, features }) as ExtendedSuggestDevPlanOutput;
      setDevPlan(result);
    } catch (e) {
      console.error(e);
      setDevPlanError("An error occurred while generating the development plan. Please try again.");
    } finally {
      setIsLoadingDevPlan(false);
    }
  };
  
  const handleGenerateAiDevPlan = async () => {
    if (features.length === 0 || !appDescription) {
      setAiDevPlanError("Please generate features and a standard development plan first.");
      return;
    }
    setIsLoadingAiDevPlan(true);
    setAiDevPlanError(null);
    setAiDevPlan(null);

    try {
      const result = await suggestAiAcceleratedDevPlan({ appDescription, features }) as ExtendedSuggestAiAcceleratedDevPlanOutput;
      setAiDevPlan(result);
    } catch (e) {
      console.error(e);
      setAiDevPlanError("An error occurred while generating the AI-accelerated development plan. Please try again.");
    } finally {
      setIsLoadingAiDevPlan(false);
    }
  };


  // Export Features
  const handleExportFeaturesAsJSON = () => {
    if (!features.length) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    const jsonData = JSON.stringify(features, null, 2);
    downloadFile(`${projectName}-features.json`, jsonData, 'application/json');
  };

  const handleExportFeaturesAsMarkdown = () => {
    if (!features.length) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    let mdData = `# Suggested Features for "${appDescription.substring(0, 50)}${appDescription.length > 50 ? '...' : ''}"\n\n`;
    mdData += `Based on your description: "${appDescription}"\n\n---\n\n`;
    features.forEach(feature => {
      mdData += `## ${feature.name}\n`;
      mdData += `**Description:** ${feature.description}\n`;
      mdData += `**Category:** ${feature.category}\n`;
      mdData += `**Complexity:** ${feature.complexity}\n\n---\n\n`;
    });
    downloadFile(`${projectName}-features.md`, mdData, 'text/markdown');
  };

  // Export Standard Dev Plan
  const handleExportDevPlanAsJSON = () => {
    if (!devPlan) return;
    const projectName = sanitizeFilename(devPlan.projectName || 'app');
    const jsonData = JSON.stringify(devPlan, null, 2);
    downloadFile(`${projectName}-standard-dev-plan.json`, jsonData, 'application/json');
  };

  const handleExportDevPlanAsMarkdown = () => {
    if (!devPlan) return;
    const projectName = sanitizeFilename(devPlan.projectName || 'app');
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
        mdData += `\n**💡 Genkit Runtime Prompt Ideas (for AI Features):**\n`;
        phase.genkitPromptSuggestions.forEach(suggestion => {
          mdData += `  - **For Feature "${suggestion.featureName}":** \`${suggestion.suggestedPrompt}\`\n`;
        });
      }
      mdData += `\n`;
    });
    mdData += `---\n\n## Overall Estimated Timeline\n${devPlan.overallTimeline}\n\n---\n\n`;
    mdData += `## Key Recommendations\n${devPlan.recommendations.map(rec => `- ${rec}`).join('\n')}\n`;
    downloadFile(`${projectName}-standard-dev-plan.md`, mdData, 'text/markdown');
  };

  // Export AI Accelerated Dev Plan
  const handleExportAiDevPlanAsJSON = () => {
    if (!aiDevPlan) return;
    const projectName = sanitizeFilename(aiDevPlan.projectName || 'app');
    const jsonData = JSON.stringify(aiDevPlan, null, 2);
    downloadFile(`${projectName}-ai-accelerated-dev-plan.json`, jsonData, 'application/json');
  };

  const handleExportAiDevPlanAsMarkdown = () => {
    if (!aiDevPlan) return;
    const projectName = sanitizeFilename(aiDevPlan.projectName || 'app');
    let mdData = `# AI-Accelerated Development Plan: ${aiDevPlan.projectName}\n\n`;
    mdData += `**Based on App Description:** ${appDescription}\n\n`;
    mdData += `## Executive Summary (AI-Accelerated)\n${aiDevPlan.executiveSummary}\n\n---\n\n`;
    mdData += `## AI-Accelerated Development Phases\n`;
    aiDevPlan.phases.forEach(phase => {
      mdData += `### ${phase.phaseTitle}\n`;
      mdData += `**Goal:** ${phase.phaseGoal}\n`;
      mdData += `**Estimated Duration (with AI Support):** ${phase.estimatedDurationWithAiSupport}\n`;
      mdData += `**Features to Implement (AI-Assisted Approach):**\n`;
      phase.featuresToImplement.forEach(featureImpl => {
        mdData += `  - **Feature: ${featureImpl.featureName}**\n`;
        mdData += `    - *AI Development Notes:* ${featureImpl.aiDevelopmentNotes}\n`;
        mdData += `    - *Suggested Coding Assistant Prompt:* \`${featureImpl.suggestedCodingAssistantPrompt}\`\n`;
      });
      mdData += `\n`;
    });
    mdData += `---\n\n## Overall Estimated Timeline (with AI Support)\n${aiDevPlan.overallTimelineWithAiSupport}\n\n---\n\n`;
    mdData += `## General AI Tooling Recommendations\n${aiDevPlan.generalAiToolingRecommendations.map(rec => `- ${rec}`).join('\n')}\n`;
    downloadFile(`${projectName}-ai-accelerated-dev-plan.md`, mdData, 'text/markdown');
  };


  useEffect(() => {
    // Placeholder for any client-side specific initializations
  }, []);

  const anyLoading = isLoadingFeatures || isLoadingDevPlan || isLoadingAiDevPlan;

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
            disabled={anyLoading}
          />
        </div>
        <div>
          <Button 
            type="submit" 
            disabled={anyLoading} 
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
              disabled={anyLoading || features.length === 0}
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportFeaturesAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={anyLoading || features.length === 0}
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              onClick={handleGenerateDevPlan} 
              disabled={anyLoading || features.length === 0}
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
                  Generate Standard Dev Plan
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {devPlanError && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Standard Development Plan Error</AlertTitle>
          <AlertDescription>{devPlanError}</AlertDescription>
        </Alert>
      )}

      {isLoadingDevPlan && !devPlan && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto" />
          <p className="mt-4 text-muted-foreground">Crafting your standard development plan...</p>
        </div>
      )}

      {devPlan && !isLoadingDevPlan && !devPlanError && (
        <Card className="w-full shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Standard Development Plan: {devPlan.projectName}
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
                              Genkit Runtime Prompt Ideas (for AI Features):
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
                <p className="text-muted-foreground">No specific phases outlined by the AI for the standard plan.</p>
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
                 <p className="text-muted-foreground">No specific recommendations provided by the AI for the standard plan.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-border">
            <h4 className="text-md font-medium text-muted-foreground mb-2 sm:mb-0">Export Standard Plan:</h4>
            <Button 
              onClick={handleExportDevPlanAsJSON} 
              variant="outline"
              size="sm"
              disabled={anyLoading || !devPlan}
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportDevPlanAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={anyLoading || !devPlan}
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
          </CardFooter>

          {!aiDevPlan && !isLoadingAiDevPlan && (
            <div className="mt-8 pt-6 border-t border-border text-center">
              <Button 
                onClick={handleGenerateAiDevPlan} 
                disabled={anyLoading || !devPlan} // Requires standard plan first
                className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700" // Example: different color
                size="lg"
              >
                <Cpu className="mr-2 h-5 w-5" />
                Generate AI-Accelerated Dev Plan
              </Button>
            </div>
          )}
        </Card>
      )}

      {aiDevPlanError && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>AI-Accelerated Development Plan Error</AlertTitle>
          <AlertDescription>{aiDevPlanError}</AlertDescription>
        </Alert>
      )}

      {isLoadingAiDevPlan && (
         <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-muted-foreground">Crafting your AI-accelerated development plan...</p>
        </div>
      )}

      {aiDevPlan && !isLoadingAiDevPlan && !aiDevPlanError && (
        <Card className="w-full shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 mb-12 border-green-500">
           <CardHeader className="pb-4 bg-green-500/10">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-green-700 flex items-center justify-center gap-2">
              <Cpu className="h-7 w-7" /> AI-Accelerated Development Plan: {aiDevPlan.projectName}
            </CardTitle>
            <p className="text-center text-muted-foreground pt-1">{aiDevPlan.executiveSummary}</p>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
            <div>
              <h4 className="text-xl font-semibold mb-3 text-foreground">AI-Accelerated Development Phases</h4>
              {aiDevPlan.phases.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {aiDevPlan.phases.map((phase, index) => (
                    <AccordionItem value={`ai-phase-${index}`} key={`ai-phase-${index}`} className="border-border">
                      <AccordionTrigger className="text-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                           <span className="text-green-600 font-semibold">{phase.phaseTitle}</span> 
                           <span className="text-sm text-muted-foreground">({phase.estimatedDurationWithAiSupport})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-1 space-y-4">
                        <p className="text-sm text-foreground font-medium">{phase.phaseGoal}</p>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-2">Features to implement (AI-Assisted Approach):</p>
                          <ul className="space-y-3">
                            {phase.featuresToImplement.map((featureImpl, idx) => (
                              <li key={idx} className="text-sm bg-muted/50 p-3 rounded-md">
                                <strong className="block text-foreground/90 mb-1">{featureImpl.featureName}</strong>
                                <p className="text-xs text-muted-foreground mb-1">
                                  <span className="font-semibold">AI Dev Notes:</span> {featureImpl.aiDevelopmentNotes}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                   <span className="font-semibold">Suggested Coding Assistant Prompt:</span>
                                </p>
                                <code className="mt-1 block bg-background p-2 rounded-md text-foreground whitespace-pre-wrap text-[0.7rem] leading-relaxed border border-border">
                                  {featureImpl.suggestedCodingAssistantPrompt}
                                </code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                 <p className="text-muted-foreground">No specific phases outlined by the AI for the AI-accelerated plan.</p>
              )}
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Overall Estimated Timeline (with AI Support)</h4>
              <p className="text-muted-foreground">{aiDevPlan.overallTimelineWithAiSupport}</p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-3 text-foreground flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-green-600"/>
                General AI Tooling Recommendations
              </h4>
              {aiDevPlan.generalAiToolingRecommendations.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {aiDevPlan.generalAiToolingRecommendations.map((rec, index) => (
                  <li key={index} className="pl-2">{rec}</li>
                ))}
              </ul>
              ) : (
                <p className="text-muted-foreground">No specific AI tooling recommendations provided.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-border">
            <h4 className="text-md font-medium text-muted-foreground mb-2 sm:mb-0">Export AI Plan:</h4>
            <Button 
              onClick={handleExportAiDevPlanAsJSON} 
              variant="outline"
              size="sm"
              disabled={anyLoading || !aiDevPlan}
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportAiDevPlanAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={anyLoading || !aiDevPlan}
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
