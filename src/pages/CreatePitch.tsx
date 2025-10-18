import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function CreatePitch() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("professional");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please log in first");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-pitch", {
        body: { idea, industry, tone },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (error.message?.includes("402")) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Failed to generate pitch. Please try again.");
        }
        console.error("Error:", error);
        return;
      }

      const { data: insertData, error: insertError } = await supabase
        .from("pitches")
        .insert({
          user_id: sessionData.session.user.id,
          startup_name: data.startup_name,
          tagline: data.tagline,
          elevator_pitch: data.elevator_pitch,
          problem_statement: data.problem_statement,
          solution_statement: data.solution_statement,
          target_audience: data.target_audience,
          unique_value_prop: data.unique_value_prop,
          landing_page_copy: data.landing_page_copy,
          industry,
          tone,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success("Pitch generated successfully!");
      navigate(`/pitch/${insertData.id}`);
    } catch (error) {
      console.error("Error generating pitch:", error);
      toast.error("Failed to save pitch");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-3xl gradient-text">Create Your Pitch</CardTitle>
              <CardDescription>
                Tell us about your startup idea and let AI craft a professional pitch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="idea">Startup Idea *</Label>
                  <Textarea
                    id="idea"
                    placeholder="Example: I want to build an app that connects students with mentors for career guidance and skill development..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    required
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., EdTech, HealthTech, FinTech"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="innovative">Innovative</SelectItem>
                      <SelectItem value="disruptive">Disruptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12"
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Pitch
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}