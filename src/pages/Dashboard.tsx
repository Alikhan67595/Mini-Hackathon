import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Loader2, Plus, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Pitch {
  id: string;
  startup_name: string;
  tagline: string;
  elevator_pitch: string;
  industry: string;
  tone: string;
  created_at: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    loadPitches();
  };

  const loadPitches = async () => {
    try {
      const { data, error } = await supabase
        .from("pitches")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPitches(data || []);
    } catch (error) {
      console.error("Error loading pitches:", error);
      toast.error("Failed to load pitches");
    } finally {
      setLoading(false);
    }
  };

  const deletePitch = async (id: string) => {
    try {
      const { error } = await supabase
        .from("pitches")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setPitches(pitches.filter(p => p.id !== id));
      toast.success("Pitch deleted successfully");
    } catch (error) {
      console.error("Error deleting pitch:", error);
      toast.error("Failed to delete pitch");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Pitches</h1>
              <p className="text-muted-foreground">
                {pitches.length === 0
                  ? "You haven't created any pitches yet"
                  : `${pitches.length} pitch${pitches.length === 1 ? "" : "es"} created`}
              </p>
            </div>
            <Button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Pitch
            </Button>
          </div>

          {pitches.length === 0 ? (
            <Card className="glass-effect">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No pitches yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Create your first AI-powered startup pitch and start impressing investors!
                </p>
                <Button
                  onClick={() => navigate("/create")}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Create Your First Pitch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pitches.map((pitch) => (
                <Card
                  key={pitch.id}
                  className="glass-effect hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {pitch.industry}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePitch(pitch.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <CardTitle
                      className="text-xl gradient-text"
                      onClick={() => navigate(`/pitch/${pitch.id}`)}
                    >
                      {pitch.startup_name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {pitch.tagline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent onClick={() => navigate(`/pitch/${pitch.id}`)}>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {pitch.elevator_pitch}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {new Date(pitch.created_at).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {pitch.tone}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}