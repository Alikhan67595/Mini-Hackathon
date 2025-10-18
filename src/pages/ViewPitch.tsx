import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Loader2, ArrowLeft, Download, Edit } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Pitch {
  id: string;
  startup_name: string;
  tagline: string;
  elevator_pitch: string;
  problem_statement: string;
  solution_statement: string;
  target_audience: string;
  unique_value_prop: string;
  landing_page_copy: string;
  industry: string;
  tone: string;
  created_at: string;
}

export default function ViewPitch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pitch, setPitch] = useState<Pitch | null>(null);

  useEffect(() => {
    loadPitch();
  }, [id]);

  const loadPitch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("pitches")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPitch(data);
    } catch (error) {
      console.error("Error loading pitch:", error);
      toast.error("Failed to load pitch");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    toast.info("PDF export coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pitch) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">{pitch.startup_name}</h1>
              <p className="text-xl text-muted-foreground">{pitch.tagline}</p>
              <div className="flex gap-2 mt-3">
                <Badge>{pitch.industry}</Badge>
                <Badge variant="outline">{pitch.tone}</Badge>
              </div>
            </div>
            <Button
              onClick={exportToPDF}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Elevator Pitch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{pitch.elevator_pitch}</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Problem Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{pitch.problem_statement}</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{pitch.solution_statement}</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{pitch.target_audience}</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Unique Value Proposition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{pitch.unique_value_prop}</p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Landing Page Copy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{pitch.landing_page_copy}</p>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              Created on {new Date(pitch.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}