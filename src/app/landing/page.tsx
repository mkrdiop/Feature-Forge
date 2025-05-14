
import { ArrowRight, BrainCircuit, CheckCircle, Lightbulb, Users, BarChart3, DollarSign, FileSpreadsheet, Target, CalendarDays, Cpu, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-4 sm:py-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/landing" className="flex items-center gap-2 text-2xl font-bold text-accent">
            <BrainCircuit className="h-8 w-8" />
            <span>Feature Forge</span>
          </Link>
          <nav className="space-x-4 flex items-center">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Launch App</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/#">Sign Up (Soon)</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Turn Your App Idea into a <span className="text-accent">Strategic Blueprint</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Stop staring at a blank page. Feature Forge uses AI to instantly generate feature lists, development plans, user personas, and monetization strategies, giving you a clear path from concept to launch.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-lg">
            <Link href="/">
              Forge Your First Feature List <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="mt-12">
            <Image 
              src="https://placehold.co/800x450.png?text=Feature+Forge+Dashboard+Mockup" 
              alt="Feature Forge Dashboard Mockup" 
              width={800} 
              height={450} 
              className="rounded-lg shadow-2xl mx-auto border border-border"
              data-ai-hint="app dashboard mockup"
            />
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">From Vague Idea to Actionable Plan</h2>
            <p className="mt-3 text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Bringing an app idea to life is challenging. Feature Forge tackles the initial hurdles head-on.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-destructive">The Challenge:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 text-destructive flex-shrink-0" />
                  <span>Overwhelmed by where to start with features?</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 text-destructive flex-shrink-0" />
                  <span>Unsure how to structure a realistic development plan?</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 text-destructive flex-shrink-0" />
                  <span>Struggling to define your target users or business model?</span>
                </li>
              </ul>
            </div>
            <div className="space-y-6 p-6 bg-secondary/50 rounded-lg shadow-md border border-border">
              <h3 className="text-2xl font-semibold text-accent">The Feature Forge Solution:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                  <span>AI-powered feature brainstorming to spark innovation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                  <span>Automated generation of development roadmaps & AI-accelerated plans.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                  <span>Insightful user personas, monetization strategies, and Lean Canvas creation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">All The Tools You Need to Ideate & Plan</h2>
            <p className="mt-3 text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Feature Forge provides a suite of AI-driven tools to transform your initial spark into a well-defined project.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Lightbulb, title: "AI Feature Suggestions", description: "Get a comprehensive list of relevant features, complete with descriptions, categories, and complexity." },
              { icon: Users, title: "User Persona Generation", description: "Understand your target audience deeply with AI-generated user personas, detailing their goals and pain points." },
              { icon: CalendarDays, title: "Standard Development Plan", description: "Receive a structured development plan with phases, timelines, and Genkit prompt ideas for AI features." },
              { icon: Cpu, title: "AI-Accelerated Dev Plan", description: "Opt for a plan optimized for AI developer tools, including coding assistant prompts for each feature." },
              { icon: DollarSign, title: "Monetization Strategies", description: "Explore viable monetization models tailored to your app concept and features." },
              { icon: Target, title: "Problem/Solution Fit", description: "Analyze how well your app solves a core problem, ensuring feature alignment and value." },
              { icon: FileSpreadsheet, title: "Lean Canvas Creation", description: "Structure your business model with an AI-generated Lean Canvas, covering all key strategic areas." },
              { icon: Bot, title: "Genkit Powered", description: "Leverages Google's powerful Gemini models via Firebase Genkit for cutting-edge AI insights." },
            ].map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="bg-accent/10 text-accent p-3 rounded-full w-fit mb-3">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Get Started in 3 Simple Steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 border border-border rounded-lg shadow-sm">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Describe Your Vision</h3>
              <p className="text-muted-foreground text-sm">Simply type in your web or mobile app idea. The more detail, the better the insights!</p>
            </div>
            <div className="flex flex-col items-center p-6 border border-border rounded-lg shadow-sm">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Generate AI Insights</h3>
              <p className="text-muted-foreground text-sm">Let Feature Forge's AI analyze your concept and provide features, plans, personas, and more.</p>
            </div>
            <div className="flex flex-col items-center p-6 border border-border rounded-lg shadow-sm">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Export & Build</h3>
              <p className="text-muted-foreground text-sm">Download your strategic assets in JSON or Markdown and start building your amazing application.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Who Can Benefit from Feature Forge?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Entrepreneurs", "Product Managers", "Indie Developers", "Students & Hackathons"].map((useCase, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md border border-border text-center">
                <p className="font-semibold text-lg text-foreground">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Loved by Innovators (Soon!)</h2>
            <p className="mt-3 text-md sm:text-lg text-muted-foreground max-w-xl mx-auto">
              We're working hard to gather feedback. Stay tuned for testimonials!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-secondary/30 border-border">
                <CardContent className="pt-6">
                  <p className="italic text-muted-foreground">"Feature Forge will be amazing! It helped me think through my app idea in ways I hadn't considered." (Anticipated)</p>
                  <p className="mt-4 font-semibold text-foreground">- Future Happy User {i}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Placeholder */}
      <section id="pricing" className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-md sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Get started for free. Powerful features for when you're ready to scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">Free Tier</CardTitle>
                <CardDescription className="text-4xl font-bold text-foreground">$0<span className="text-sm font-normal text-muted-foreground">/month</span></CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Basic Feature Suggestions</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Limited Generations per Day</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Community Support</li>
                </ul>
                <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href="/">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-2 border-accent relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded-full">
                POPULAR
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">Pro Tier</CardTitle>
                <CardDescription className="text-4xl font-bold text-foreground">$19<span className="text-sm font-normal text-muted-foreground">/month (Coming Soon)</span></CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> All Strategic Tools (Dev Plans, Personas, etc.)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> Unlimited Generations</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> Save & Manage Projects (Soon)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> Priority Support (Soon)</li>
                </ul>
                 <Button className="w-full mt-4" disabled>Notify Me (Coming Soon)</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            Ready to Forge Your Next Big Idea?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Stop guessing and start planning. Leverage the power of AI to build a solid foundation for your application.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-lg">
            <Link href="/">
              Start Forging Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-secondary/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Feature Forge. All rights reserved. Built with AI.</p>
          <div className="mt-2 space-x-4">
            <Link href="/landing#features" className="hover:text-foreground">Features</Link>
            <Link href="/landing#pricing" className="hover:text-foreground">Pricing</Link>
            {/* <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link> */}
            {/* <Link href="/terms" className="hover:text-foreground">Terms of Service</Link> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

