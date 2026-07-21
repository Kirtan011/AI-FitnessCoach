"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MuscleSelector } from "@/components/muscle-selector";
import { LoadingScreen } from "@/components/loading-screen";
import { Highlight, Pill } from "@/components/shared";
import { ArrowRightIcon, CrosshairIcon, InfoIcon, DownloadIcon, PlayCircle } from "lucide-react";
import { RefreshIcon } from "@/components/icons";
import { UserProfile, FitnessPlan } from "@/lib/types";
import Image from "next/image";
import { generateFitnessPlanPDF } from "@/lib/pdf-export";
import { VideoModal } from "@/components/video-modal";

export default function TargetMusclePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [miniPlan, setMiniPlan] = useState<FitnessPlan | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/fitness-plan");
        if (response.ok) {
          const data = await response.json();
          if (data && data.profile) {
            setUserProfile(data.profile);
            if (data.profile.targetMuscles) {
              setSelected(data.profile.targetMuscles);
            }
          }
        }
        
        // Load mini plan from localStorage
        const savedMiniPlan = localStorage.getItem("miniPlan");
        const savedTargetMuscles = localStorage.getItem("targetMuscles");
        if (savedMiniPlan) {
          setMiniPlan(JSON.parse(savedMiniPlan));
        }
        if (savedTargetMuscles) {
          setSelected(JSON.parse(savedTargetMuscles));
        }
      } catch (error) {
        console.error("Failed to fetch profile or load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const toggleMuscle = (muscle: string) => {
    setSelected(prev => 
      prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle]
    );
  };

  const handleGenerate = async () => {
    if (!userProfile) return;
    
    setIsGenerating(true);
    try {
      const updatedProfile = { ...userProfile, targetMuscles: selected };
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: updatedProfile, isRegenerate: true, saveToDb: false }),
      });

      if (!response.ok) throw new Error("Failed to generate plan");

      const planData = await response.json();
      setMiniPlan(planData);
      
      // Save to localStorage so it persists across navigation
      localStorage.setItem("miniPlan", JSON.stringify(planData));
      localStorage.setItem("targetMuscles", JSON.stringify(selected));
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Failed to generate targeted plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading muscle map..." subtitle="Target Focus" />;
  }

  if (isGenerating) {
    return <LoadingScreen message="AI is crafting your customized target plan..." subtitle="Target Focus" />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500 space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-3">
          <Pill>Advanced AI Tuning</Pill>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Target <Highlight>Specific Muscles</Highlight>
          </h2>
          <p className="text-muted-foreground">
            Select the precise muscle groups you want to focus on for your next workout plan.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card shadow-sm border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <CrosshairIcon className="h-5 w-5 text-primary" /> 
                Interactive Muscle Map
              </CardTitle>
              <CardDescription>Click on any muscle group to toggle its selection.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div className="flex-1 flex flex-col items-center py-10 px-4 bg-gradient-to-br from-background to-secondary/20 relative group">
                  <h3 className="absolute top-4 left-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Anterior (Front)</h3>
                  <MuscleSelector 
                    type="anterior" 
                    selectedMuscles={selected} 
                    onSelectMuscle={toggleMuscle}
                    className="w-full max-w-[300px] h-[500px]"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center py-10 px-4 bg-gradient-to-br from-secondary/20 to-background relative group">
                  <h3 className="absolute top-4 left-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Posterior (Back)</h3>
                  <MuscleSelector 
                    type="posterior" 
                    selectedMuscles={selected} 
                    onSelectMuscle={toggleMuscle}
                    className="w-full max-w-[300px] h-[500px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-primary/20 sticky top-24">
            <CardHeader>
              <CardTitle>Selected Targets</CardTitle>
              <CardDescription>Your AI coach will tailor the plan to these muscles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="min-h-[120px] bg-secondary/30 rounded-xl p-4 border border-border/50">
                {selected.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-3 py-4">
                     <div className="relative w-20 h-20 opacity-50">
                       <Image src="/clipart/undraw_athletes-training_koqa.svg" alt="Select muscles" fill className="object-contain" />
                     </div>
                     <p className="text-sm">Click the interactive map to select muscles.</p>
                   </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selected.map(m => (
                      <span key={m} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full capitalize animate-in zoom-in duration-200">
                        {m.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full font-bold shadow-md h-14 text-base group" 
                  onClick={handleGenerate} 
                  disabled={selected.length === 0 || isGenerating}
                >
                  {isGenerating ? (
                    <RefreshIcon className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CrosshairIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  )}
                  {isGenerating ? "Processing..." : "Generate Custom Plan"}
                  {!isGenerating && <ArrowRightIcon className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />}
                </Button>
                <p className="text-xs text-center text-muted-foreground leading-relaxed px-4">
                  This will generate a targeted workout below without replacing your main plan.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {miniPlan && (
        <div className="mt-12 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <h3 className="text-2xl font-display font-bold">Your Targeted Mini-Plan</h3>
              <p className="text-muted-foreground text-sm">Focusing specifically on your selected muscles.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="font-medium text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => {
                setMiniPlan(null);
                localStorage.removeItem("miniPlan");
                localStorage.removeItem("targetMuscles");
              }}>
                Clear
              </Button>
              <Button variant="outline" className="font-medium shadow-sm" onClick={() => {
                setIsExporting(true);
                setTimeout(() => {
                  if (userProfile && miniPlan) {
                    generateFitnessPlanPDF(miniPlan, userProfile);
                  }
                  setIsExporting(false);
                }, 500);
              }} disabled={isExporting}>
                {isExporting ? (
                  <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <DownloadIcon className="mr-2 h-4 w-4" />
                )}
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6">
            {miniPlan.workoutPlan?.flatMap(day => day.exercises || [])
              .filter((ex, index, self) => index === self.findIndex((e) => e.name === ex.name)) // Unique exercises
              .map((ex, idx) => (
              <Card key={idx} className="overflow-hidden border-border/50 shadow-sm animate-in fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex flex-col">
                  <div className="p-6 space-y-6 bg-card w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <h4 className="text-2xl font-bold font-display text-primary">{ex.name}</h4>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                          {ex.sets} Sets
                        </span>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                          {ex.reps}
                        </span>
                        {ex.restTime && (
                          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                            {ex.restTime} Rest
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {ex.videoUrl && (
                      <div className="w-full sm:w-max">
                        <VideoModal exerciseName={ex.name} />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                          <InfoIcon className="h-4 w-4" /> How to perform
                        </h5>
                        <p className="text-sm leading-relaxed text-foreground/90">{ex.instructions || "Follow standard form for this exercise."}</p>
                      </div>

                      {(ex.notes || (ex.equipment && ex.equipment.length > 0)) && (
                        <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2 flex items-center gap-1">
                            <CrosshairIcon className="h-4 w-4" /> Key things to keep in mind
                          </h5>
                          {ex.notes && <p className="text-sm leading-relaxed text-foreground/80">{ex.notes}</p>}
                          {ex.equipment && ex.equipment.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2 items-center">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Equipment:</span>
                              {ex.equipment.map(eq => (
                                <span key={eq} className="text-xs bg-background border border-border px-2 py-1 rounded-md">{eq}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
