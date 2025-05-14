
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Loader2, AlertTriangle, Info, CalendarDays, Lightbulb, FileJson, FileText, 
  Download, Sparkles, Cpu, Users, UserCircle, Target, Activity, ThumbsUp, ThumbsDown, 
  Briefcase, Brain, DollarSign, TrendingUp, HelpCircle, AlertCircle, SearchCheck, BookOpen, AlignLeft
} from 'lucide-react';

import { suggestFeatures } from '@/ai/flows/suggest-features';
import type { SuggestFeaturesOutput, FeatureDetail } from '@/ai/flows/suggest-features';
import { suggestDevPlan } from '@/ai/flows/suggest-dev-plan';
import type { SuggestDevPlanOutput, DevPlanPhase as OriginalDevPlanPhase } from '@/ai/flows/suggest-dev-plan';
import { suggestAiAcceleratedDevPlan } from '@/ai/flows/suggest-ai-accelerated-dev-plan';
import type { SuggestAiAcceleratedDevPlanOutput, AiAcceleratedDevPlanPhase as OriginalAiDevPlanPhase } from '@/ai/flows/suggest-ai-accelerated-dev-plan';
import { suggestUserPersonas } from '@/ai/flows/suggest-user-personas';
import type { SuggestUserPersonasOutput, UserPersona } from '@/ai/flows/suggest-user-personas';
import { suggestMonetizationStrategies } from '@/ai/flows/suggest-monetization-strategies';
import type { SuggestMonetizationStrategiesOutput, MonetizationStrategy } from '@/ai/flows/suggest-monetization-strategies';
import { suggestProblemSolutionFit } from '@/ai/flows/suggest-problem-solution-fit'; // New import
import type { SuggestProblemSolutionFitOutput } from '@/ai/flows/suggest-problem-solution-fit'; // New import


import FeatureCard from '@/components/feature-card';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';


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

  const [userPersonas, setUserPersonas] = useState<UserPersona[]>([]);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState<boolean>(false);
  const [personasError, setPersonasError] = useState<string | null>(null);

  const [monetizationStrategies, setMonetizationStrategies] = useState<MonetizationStrategy[]>([]);
  const [isLoadingMonetization, setIsLoadingMonetization] = useState<boolean>(false);
  const [monetizationError, setMonetizationError] = useState<string | null>(null);

  const [problemSolutionFitAnalysis, setProblemSolutionFitAnalysis] = useState<SuggestProblemSolutionFitOutput | null>(null);
  const [isLoadingProblemSolutionFit, setIsLoadingProblemSolutionFit] = useState<boolean>(false);
  const [problemSolutionFitError, setProblemSolutionFitError] = useState<string | null>(null);


  const sanitizeFilename = (name: string) => {
    if (!name) return 'app-idea';
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
    // Reset all subsequent sections
    setDevPlan(null); 
    setDevPlanError(null);
    setAiDevPlan(null);
    setAiDevPlanError(null);
    setUserPersonas([]);
    setPersonasError(null);
    setMonetizationStrategies([]);
    setMonetizationError(null);
    setProblemSolutionFitAnalysis(null);
    setProblemSolutionFitError(null);


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

  const handleGenerateUserPersonas = async () => {
    if (!appDescription) {
      setPersonasError("Please provide an app description first.");
      return;
    }
    setIsLoadingPersonas(true);
    setPersonasError(null);
    setUserPersonas([]);

    try {
      const result: SuggestUserPersonasOutput = await suggestUserPersonas({ appDescription });
      if (result.personas && result.personas.length > 0) {
        setUserPersonas(result.personas);
      } else {
        setPersonasError("No user personas were generated. Try refining your app description.");
      }
    } catch (e) {
      console.error(e);
      setPersonasError("An error occurred while generating user personas. Please try again.");
    } finally {
      setIsLoadingPersonas(false);
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
    setAiDevPlan(null); 
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

  const handleGenerateMonetizationStrategies = async () => {
    if (features.length === 0 || !appDescription) {
      setMonetizationError("Please generate features first and ensure an app description is provided.");
      return;
    }
    setIsLoadingMonetization(true);
    setMonetizationError(null);
    setMonetizationStrategies([]);

    try {
      const result: SuggestMonetizationStrategiesOutput = await suggestMonetizationStrategies({ appDescription, features });
      if (result.strategies && result.strategies.length > 0) {
        setMonetizationStrategies(result.strategies);
      } else {
        setMonetizationError("No monetization strategies were suggested. Try refining your app description or features.");
      }
    } catch (e) {
      console.error(e);
      setMonetizationError("An error occurred while generating monetization strategies. Please try again.");
    } finally {
      setIsLoadingMonetization(false);
    }
  };

  const handleGenerateProblemSolutionFit = async () => {
    if (features.length === 0 || !appDescription) {
      setProblemSolutionFitError("Please generate features first and ensure an app description is provided.");
      return;
    }
    setIsLoadingProblemSolutionFit(true);
    setProblemSolutionFitError(null);
    setProblemSolutionFitAnalysis(null);

    try {
      const result: SuggestProblemSolutionFitOutput = await suggestProblemSolutionFit({ appDescription, features });
      setProblemSolutionFitAnalysis(result);
    } catch (e) {
      console.error(e);
      setProblemSolutionFitError("An error occurred while generating the Problem/Solution Fit Analysis. Please try again.");
    } finally {
      setIsLoadingProblemSolutionFit(false);
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

  // Export User Personas
  const handleExportPersonasAsJSON = () => {
    if (!userPersonas.length) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    const jsonData = JSON.stringify(userPersonas, null, 2);
    downloadFile(`${projectName}-user-personas.json`, jsonData, 'application/json');
  };

  const handleExportPersonasAsMarkdown = () => {
    if (!userPersonas.length) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    let mdData = `# User Personas for "${appDescription.substring(0, 50)}${appDescription.length > 50 ? '...' : ''}"\n\n`;
    mdData += `Based on your description: "${appDescription}"\n\n---\n\n`;
    userPersonas.forEach(persona => {
      mdData += `## Persona: ${persona.personaName}\n\n`;
      mdData += `**Age Range:** ${persona.ageRange}\n`;
      mdData += `**Occupation:** ${persona.occupation}\n`;
      mdData += `**Tech Savviness:** ${persona.techSavviness}\n\n`;
      mdData += `### Bio:\n${persona.briefBio}\n\n`;
      mdData += `### Key Goals:\n${persona.keyGoals.map(g => `- ${g}`).join('\n')}\n\n`;
      mdData += `### Pain Points:\n${persona.painPoints.map(p => `- ${p}`).join('\n')}\n\n`;
      mdData += `### Motivations for Using App:\n${persona.motivationsForUsingApp.map(m => `- ${m}`).join('\n')}\n\n---\n\n`;
    });
    downloadFile(`${projectName}-user-personas.md`, mdData, 'text/markdown');
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

  // Export Monetization Strategies
  const handleExportMonetizationAsJSON = () => {
    if (!monetizationStrategies.length) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    const jsonData = JSON.stringify(monetizationStrategies, null, 2);
    downloadFile(`${projectName}-monetization-strategies.json`, jsonData, 'application/json');
  };

  const handleExportMonetizationAsMarkdown = () => {
    if (!monetizationStrategies.length) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    let mdData = `# Monetization Strategies for "${appDescription.substring(0, 50)}${appDescription.length > 50 ? '...' : ''}"\n\n`;
    mdData += `Based on your app description and features.\n\n---\n\n`;
    monetizationStrategies.forEach(strategy => {
      mdData += `## Strategy: ${strategy.strategyName}\n\n`;
      mdData += `**Description:** ${strategy.description}\n\n`;
      mdData += `**Suitability for this App:** ${strategy.suitabilityRationale}\n\n`;
      mdData += `**Potential Drawbacks:** ${strategy.potentialDrawbacks}\n\n`;
      mdData += `**Key Considerations:**\n${strategy.keyConsiderations.map(c => `- ${c}`).join('\n')}\n\n---\n\n`;
    });
    downloadFile(`${projectName}-monetization-strategies.md`, mdData, 'text/markdown');
  };

  // Export Problem/Solution Fit Analysis
  const handleExportProblemSolutionFitAsJSON = () => {
    if (!problemSolutionFitAnalysis) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    const jsonData = JSON.stringify(problemSolutionFitAnalysis, null, 2);
    downloadFile(`${projectName}-problem-solution-fit.json`, jsonData, 'application/json');
  };

  const handleExportProblemSolutionFitAsMarkdown = () => {
    if (!problemSolutionFitAnalysis) return;
    const projectName = sanitizeFilename(devPlan?.projectName || aiDevPlan?.projectName || 'app');
    let mdData = `# Problem/Solution Fit Analysis for "${appDescription.substring(0, 50)}${appDescription.length > 50 ? '...' : ''}"\n\n`;
    mdData += `Based on your app description: "${appDescription}"\n\n---\n\n`;
    mdData += `## Identified Problem\n${problemSolutionFitAnalysis.identifiedProblem}\n\n`;
    mdData += `## Solution Overview\n${problemSolutionFitAnalysis.solutionOverview}\n\n`;
    mdData += `## Feature Alignment Analysis\n`;
    problemSolutionFitAnalysis.featureAlignmentAnalysis.forEach(item => {
      mdData += `### Feature: ${item.featureName}\n`;
      mdData += `**Alignment Note:** ${item.alignmentNote}\n\n`;
    });
    mdData += `## Overall Assessment\n${problemSolutionFitAnalysis.overallAssessment}\n`;
    downloadFile(`${projectName}-problem-solution-fit.md`, mdData, 'text/markdown');
  };


  useEffect(() => {
    // Placeholder for any client-side specific initializations
  }, []);

  const anyLoading = isLoadingFeatures || isLoadingDevPlan || isLoadingAiDevPlan || isLoadingPersonas || isLoadingMonetization || isLoadingProblemSolutionFit;

  return (
    <div className="max-w-4xl mx-auto">
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
          
          <div className="mt-10 text-center space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
             <Button 
              onClick={handleGenerateUserPersonas} 
              disabled={anyLoading || !appDescription.trim()}
              className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700" 
              size="lg"
            >
              {isLoadingPersonas ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Personas...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-5 w-5" />
                  Generate User Personas
                </>
              )}
            </Button>
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
                  Standard Dev Plan
                </>
              )}
            </Button>
             <Button 
              onClick={handleGenerateMonetizationStrategies} 
              disabled={anyLoading || features.length === 0}
              className="w-full sm:w-auto bg-yellow-500 text-black hover:bg-yellow-600"
              size="lg"
            >
              {isLoadingMonetization ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Suggesting Strategies...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-5 w-5" />
                  Suggest Monetization
                </>
              )}
            </Button>
            <Button 
              onClick={handleGenerateProblemSolutionFit} 
              disabled={anyLoading || features.length === 0}
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
              size="lg"
            >
              {isLoadingProblemSolutionFit ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Fit...
                </>
              ) : (
                <>
                  <SearchCheck className="mr-2 h-5 w-5" />
                  Analyze Problem/Solution Fit
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {personasError && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>User Persona Generation Error</AlertTitle>
          <AlertDescription>{personasError}</AlertDescription>
        </Alert>
      )}

      {isLoadingPersonas && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-muted-foreground">Crafting your user personas...</p>
        </div>
      )}

      {userPersonas.length > 0 && !isLoadingPersonas && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">Generated User Personas</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userPersonas.map((persona, index) => (
              <Card 
                key={index} 
                className="shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 flex flex-col border-purple-500/50"
                style={{ animationDelay: `${index * 150}ms`}}
              >
                <CardHeader className="bg-purple-500/10 pb-4">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-purple-700 flex items-center gap-2">
                    <UserCircle className="h-7 w-7" /> {persona.personaName}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary" className="text-xs">Age: {persona.ageRange}</Badge>
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> {persona.occupation}
                    </Badge>
                     <Badge variant="secondary" className="text-xs flex items-center gap-1">
                       <Brain className="h-3 w-3" /> Tech: {persona.techSavviness}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6 py-5 flex-grow">
                  <div>
                    <h4 className="text-md font-semibold mb-1 text-foreground">Bio:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{persona.briefBio}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-foreground flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-green-600"/> Key Goals:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                      {persona.keyGoals.map((goal, i) => <li key={i}>{goal}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-foreground flex items-center gap-1.5">
                      <ThumbsDown className="h-4 w-4 text-red-600"/> Pain Points:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                      {persona.painPoints.map((painPoint, i) => <li key={i}>{painPoint}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-foreground flex items-center gap-1.5">
                      <ThumbsUp className="h-4 w-4 text-blue-600"/> Motivations for Using App:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                      {persona.motivationsForUsingApp.map((motivation, i) => <li key={i}>{motivation}</li>)}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border bg-muted/30">
                  {/* Could add persona specific actions here if needed */}
                </CardFooter>
              </Card>
            ))}
          </div>
           <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-center items-center gap-4">
             <h4 className="text-md font-medium text-muted-foreground mb-2 sm:mb-0">Export Personas:</h4>
            <Button 
              onClick={handleExportPersonasAsJSON} 
              variant="outline"
              size="sm"
              disabled={anyLoading || userPersonas.length === 0}
              className="border-purple-500 text-purple-600 hover:bg-purple-500/10 hover:text-purple-700"
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportPersonasAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={anyLoading || userPersonas.length === 0}
              className="border-purple-500 text-purple-600 hover:bg-purple-500/10 hover:text-purple-700"
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
          </div>
        </div>
      )}
      
      {monetizationError && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Monetization Strategy Error</AlertTitle>
          <AlertDescription>{monetizationError}</AlertDescription>
        </Alert>
      )}

      {isLoadingMonetization && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto" />
          <p className="mt-4 text-muted-foreground">Brainstorming monetization strategies...</p>
        </div>
      )}

      {monetizationStrategies.length > 0 && !isLoadingMonetization && (
        <Card className="w-full shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 mb-12 border-yellow-500/70">
          <CardHeader className="pb-4 bg-yellow-500/10">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-yellow-700 flex items-center justify-center gap-2">
              <DollarSign className="h-7 w-7" /> Potential Monetization Strategies
            </CardTitle>
            <p className="text-center text-muted-foreground pt-1">Consider these strategies for your app.</p>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
            <Accordion type="multiple" className="w-full">
              {monetizationStrategies.map((strategy, index) => (
                <AccordionItem value={`monetization-${index}`} key={index} className="border-border">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center gap-3">
                       <span className="text-yellow-600 font-semibold">{strategy.strategyName}</span> 
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-1 space-y-3">
                    <div>
                      <h5 className="text-sm font-semibold text-foreground mb-1">Description:</h5>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-green-600" /> Suitability Rationale:
                      </h5>
                      <p className="text-sm text-muted-foreground">{strategy.suitabilityRationale}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-red-600" /> Potential Drawbacks:
                      </h5>
                      <p className="text-sm text-muted-foreground">{strategy.potentialDrawbacks}</p>
                    </div>
                     <div>
                      <h5 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-blue-600" /> Key Considerations:
                      </h5>
                      <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-muted-foreground">
                        {strategy.keyConsiderations.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
           <CardFooter className="flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-border">
            <h4 className="text-md font-medium text-muted-foreground mb-2 sm:mb-0">Export Strategies:</h4>
            <Button 
              onClick={handleExportMonetizationAsJSON} 
              variant="outline"
              size="sm"
              disabled={anyLoading || monetizationStrategies.length === 0}
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700"
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportMonetizationAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={anyLoading || monetizationStrategies.length === 0}
               className="border-yellow-500 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700"
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
          </CardFooter>
        </Card>
      )}

      {problemSolutionFitError && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Problem/Solution Fit Analysis Error</AlertTitle>
          <AlertDescription>{problemSolutionFitError}</AlertDescription>
        </Alert>
      )}

      {isLoadingProblemSolutionFit && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-muted-foreground">Analyzing problem/solution fit...</p>
        </div>
      )}

      {problemSolutionFitAnalysis && !isLoadingProblemSolutionFit && (
        <Card className="w-full shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 mb-12 border-blue-500/70">
          <CardHeader className="pb-4 bg-blue-500/10">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-blue-700 flex items-center justify-center gap-2">
              <SearchCheck className="h-7 w-7" /> Problem/Solution Fit Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6 py-6">
            <div>
              <h4 className="text-xl font-semibold mb-2 text-blue-700 flex items-center gap-1.5">
                <Target className="h-5 w-5"/> Identified Problem
              </h4>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">{problemSolutionFitAnalysis.identifiedProblem}</p>
            </div>
            <Separator />
            <div>
              <h4 className="text-xl font-semibold mb-2 text-blue-700 flex items-center gap-1.5">
                <Lightbulb className="h-5 w-5"/> Solution Overview
              </h4>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">{problemSolutionFitAnalysis.solutionOverview}</p>
            </div>
            <Separator />
            <div>
              <h4 className="text-xl font-semibold mb-3 text-blue-700 flex items-center gap-1.5">
                 <AlignLeft className="h-5 w-5"/> Feature Alignment Analysis
              </h4>
              {problemSolutionFitAnalysis.featureAlignmentAnalysis.length > 0 ? (
                <div className="space-y-4">
                  {problemSolutionFitAnalysis.featureAlignmentAnalysis.map((item, index) => (
                    <div key={index} className="p-3 border border-border rounded-md bg-background shadow-sm">
                      <h5 className="text-md font-semibold text-foreground mb-1">{item.featureName}</h5>
                      <p className="text-sm text-muted-foreground">{item.alignmentNote}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific feature alignments provided by the AI.</p>
              )}
            </div>
            <Separator />
            <div>
              <h4 className="text-xl font-semibold mb-2 text-blue-700 flex items-center gap-1.5">
                <BookOpen className="h-5 w-5"/> Overall Assessment
              </h4>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">{problemSolutionFitAnalysis.overallAssessment}</p>
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-border">
            <h4 className="text-md font-medium text-muted-foreground mb-2 sm:mb-0">Export Analysis:</h4>
            <Button 
              onClick={handleExportProblemSolutionFitAsJSON} 
              variant="outline"
              size="sm"
              disabled={anyLoading || !problemSolutionFitAnalysis}
              className="border-blue-500 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button 
              onClick={handleExportProblemSolutionFitAsMarkdown} 
              variant="outline"
              size="sm"
              disabled={anyLoading || !problemSolutionFitAnalysis}
              className="border-blue-500 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
            >
              <FileText className="mr-2 h-4 w-4" /> Markdown
            </Button>
          </CardFooter>
        </Card>
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
                disabled={anyLoading || !devPlan} 
                className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700" 
                size="lg"
              >
                <Cpu className="mr-2 h-5 w-5" />
                AI-Accelerated Dev Plan
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
