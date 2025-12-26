"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FitnessPlan, UserProfile } from "@/lib/types";
import {
  DumbbellIcon,
  SaladIcon,
  SparklesIcon,
  VolumeIcon,
  DownloadIcon,
  RefreshIcon,
  FlameIcon,
  ClockIcon,
  QuoteIcon,
  CheckIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { ImageModal } from "./image-modal";

interface PlanDisplayProps {
  plan: FitnessPlan;
  userProfile: UserProfile;
  onRegenerate: () => void;
  isLoading: boolean;
}

export function PlanDisplay({
  plan,
  userProfile,
  onRegenerate,
  isLoading,
}: PlanDisplayProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSection, setSpeakingSection] = useState<
    "workout" | "diet" | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: "exercise" | "meal";
    name: string;
  } | null>(null);

  const speakPlan = (section: "workout" | "diet") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      let text = "";
      if (section === "workout") {
        text = `Here's your workout plan. ${plan.workoutPlan
          .map(
            (day) =>
              `${day.day}: ${day.focus}. ${day.exercises
                .map((e) => `${e.name}, ${e.sets} sets of ${e.reps}`)
                .join(". ")}`
          )
          .join(". ")}`;
      } else {
        text = `Here's your diet plan. Breakfast: ${plan.dietPlan.breakfast.name}. Lunch: ${plan.dietPlan.lunch.name}. Dinner: ${plan.dietPlan.dinner.name}. Total calories: ${plan.dietPlan.totalCalories}.`;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingSection(section);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingSection(null);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingSection(null);
  };

  const exportToPDF = () => {
    const content = `FitBeat - Plan for ${userProfile.name}...`; // Simplified for brevity
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FitBeat-plan-${userProfile.name
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <SparklesIcon className="h-3 w-3" />
            AI Generated Plan
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Crush it,
            </span>{" "}
            {userProfile.name}?
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Your custom blueprint for{" "}
            <span className="text-foreground font-semibold underline decoration-accent/30">
              {userProfile.fitnessGoal.replace("-", " ")}
            </span>
            .
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={exportToPDF}
            className="rounded-2xl border-2 border-border hover:bg-secondary"
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={onRegenerate}
            disabled={isLoading}
            className="rounded-2xl bg-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
          >
            <RefreshIcon
              className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
            />
            {isLoading ? "Regenerating..." : "Optimize Plan"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <div className="px-4 mb-8">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 h-16 p-2 rounded-2xl bg-secondary/50 backdrop-blur-md border border-border/50">
            <TabsTrigger
              value="workout"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2 text-base"
            >
              <DumbbellIcon className="h-5 w-5" /> Workout
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2 text-base"
            >
              <SaladIcon className="h-5 w-5" /> Nutrition
            </TabsTrigger>
            <TabsTrigger
              value="tips"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2 text-base"
            >
              <SparklesIcon className="h-5 w-5" /> Insights
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Workout Content */}
        <TabsContent value="workout" className="space-y-8 px-4 outline-none">
          <div className="flex items-center justify-between bg-accent/5 p-4 rounded-2xl border border-accent/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-xl text-accent">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">Weekly Schedule</p>
                <p className="text-sm text-muted-foreground">
                  7 Days of personalized training
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                isSpeaking && speakingSection === "workout"
                  ? stopSpeaking()
                  : speakPlan("workout")
              }
              className="rounded-xl gap-2 font-semibold"
            >
              <VolumeIcon
                className={cn("h-4 w-4", isSpeaking && "animate-pulse")}
              />
              {isSpeaking && speakingSection === "workout"
                ? "Stop Audio"
                : "Listen to Plan"}
            </Button>
          </div>

          <div className="grid gap-8">
            {plan.workoutPlan.map((day, index) => (
              <div
                key={index}
                className="group relative grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-4"
              >
                <div className="hidden lg:flex flex-col items-center pt-2">
                  <div className="text-xs font-black text-muted-foreground/50 uppercase mb-1">
                    Day
                  </div>
                  <div className="text-3xl font-black text-primary/40 group-hover:text-primary transition-colors">
                    0{index + 1}
                  </div>
                </div>

                <Card className="relative overflow-hidden border-none shadow-xl shadow-black/5 bg-card/60 backdrop-blur-sm group-hover:ring-2 ring-primary/20 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent" />
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        {day.day}
                        <span className="text-sm font-medium px-3 py-1 bg-secondary rounded-full text-muted-foreground">
                          {day.focus}
                        </span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-lg">
                          <FlameIcon className="h-3.5 w-3.5" />{" "}
                          {day.caloriesBurned} kcal
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-lg">
                          <ClockIcon className="h-3.5 w-3.5" /> {day.duration}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-3">
                    {day.exercises.map((exercise, exIndex) => (
                      <button
                        key={exIndex}
                        onClick={() =>
                          setSelectedItem({
                            type: "exercise",
                            name: exercise.name,
                          })
                        }
                        className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-background transition-all group/item text-left"
                      >
                        <div className="h-10 w-10 shrink-0 rounded-full bg-background flex items-center justify-center font-bold text-xs border border-border group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                          {exIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate group-hover/item:text-primary transition-colors">
                            {exercise.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {exercise.sets} Sets • {exercise.reps} Reps •{" "}
                            {exercise.restTime} Rest
                          </p>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Nutrition Content */}
        <TabsContent value="diet" className="space-y-8 px-4 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-full md:col-span-1 border-none bg-primary text-primary-foreground overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <FlameIcon className="h-32 w-32" />
              </div>
              <CardContent className="p-8 relative">
                <p className="text-primary-foreground/80 font-medium mb-1">
                  Target Intake
                </p>
                <h3 className="text-5xl font-black mb-6">
                  {plan.dietPlan.totalCalories}{" "}
                  <span className="text-xl opacity-70">kcal</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold border-b border-primary-foreground/20 pb-2">
                    <span>Daily Goal</span>
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Optimized macronutrients based on your activity levels and
                    metabolic rate.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-4">
              {/* Simplified Meal Row */}
              {[
                {
                  label: "Breakfast",
                  meal: plan.dietPlan.breakfast,
                  emoji: "🍳",
                },
                { label: "Lunch", meal: plan.dietPlan.lunch, emoji: "🍱" },
                { label: "Dinner", meal: plan.dietPlan.dinner, emoji: "🥗" },
              ].map(({ label, meal, emoji }, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setSelectedItem({ type: "meal", name: meal.name })
                  }
                  className="w-full flex items-center gap-6 p-5 rounded-3xl bg-card border border-border/50 hover:shadow-lg transition-all text-left"
                >
                  <span className="text-4xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase text-primary tracking-widest">
                        {label}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <h4 className="font-bold text-lg">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {meal.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tips Content */}
        <TabsContent value="tips" className="px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-10">
              <QuoteIcon className="h-8 w-8 mx-auto text-primary/40 mb-2" />
              <p className="text-2xl italic font-medium tracking-tight">
                "{plan.motivation}"
              </p>
            </div>

            <div className="grid gap-4">
              {plan.tips.map((tip, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-3xl bg-secondary/20 border border-transparent hover:border-primary/20 hover:bg-background transition-all flex gap-5 items-start"
                >
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <CheckIcon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedItem && (
        <ImageModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          itemName={selectedItem.name}
          itemType={selectedItem.type}
        />
      )}
    </div>
  );
}
