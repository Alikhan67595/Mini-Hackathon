import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Sparkles, Lightbulb, Target, Rocket, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background z-0" />
        
        <div className="container relative z-10 mx-auto px-4 pt-32 pb-20 text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full glass-effect border border-primary/20">
            <span className="text-sm gradient-text font-semibold">
              ✨ AI-Powered Pitch Generator
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your Ideas Into
            <br />
            <span className="gradient-text">Professional Pitches</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            PitchCraft uses advanced AI to help you create compelling startup pitches in minutes.
            Perfect for founders, students, and entrepreneurs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 h-14 animate-glow"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14 border-primary/30 hover:bg-primary/10"
              >
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">PitchCraft</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional startup pitches that impress investors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-colors animate-float">
            <CardContent className="pt-6">
              <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Creative Names</h3>
              <p className="text-muted-foreground">
                Generate catchy startup names and taglines that stand out
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-secondary/20 hover:border-secondary/40 transition-colors animate-float" style={{ animationDelay: "0.1s" }}>
            <CardContent className="pt-6">
              <div className="mb-4 p-3 rounded-lg bg-secondary/10 w-fit">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Target Audience</h3>
              <p className="text-muted-foreground">
                Define your perfect customer persona and market fit
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-accent/20 hover:border-accent/40 transition-colors animate-float" style={{ animationDelay: "0.2s" }}>
            <CardContent className="pt-6">
              <div className="mb-4 p-3 rounded-lg bg-accent/10 w-fit">
                <Rocket className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pitch Perfect</h3>
              <p className="text-muted-foreground">
                Craft compelling elevator pitches and problem-solution statements
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-colors animate-float" style={{ animationDelay: "0.3s" }}>
            <CardContent className="pt-6">
              <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">
                Get professional pitch content in seconds, not hours
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="glass-effect max-w-4xl mx-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <CardContent className="relative pt-12 pb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Craft Your <span className="gradient-text">Perfect Pitch</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of founders who are using PitchCraft to turn their ideas into
              investor-ready presentations
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-10 h-14"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 PitchCraft. Built with AI to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
}