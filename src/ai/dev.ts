
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-features.ts';
import '@/ai/flows/suggest-dev-plan.ts';
import '@/ai/flows/suggest-ai-accelerated-dev-plan.ts';
import '@/ai/flows/suggest-user-personas.ts';
import '@/ai/flows/suggest-monetization-strategies.ts'; // Added new flow for monetization strategies
