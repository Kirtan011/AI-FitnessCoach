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
    const content = `
FitBeat - Your Personalized Fitness Plan
Generated for: ${userProfile.name}

=== WORKOUT PLAN ===
${plan.workoutPlan
  .map(
    (day) => `
${day.day} - ${day.focus}
Duration: ${day.duration} | Calories: ${day.caloriesBurned}
${day.exercises
  .map((e) => `• ${e.name}: ${e.sets} sets x ${e.reps} (Rest: ${e.restTime})`)
  .join("\n")}
`
  )
  .join("\n")}

=== DIET PLAN ===
Breakfast: ${plan.dietPlan.breakfast.name} - ${plan.dietPlan.breakfast.calories}
Mid-Morning Snack: ${plan.dietPlan.midMorningSnack.name} - ${
      plan.dietPlan.midMorningSnack.calories
    }
Lunch: ${plan.dietPlan.lunch.name} - ${plan.dietPlan.lunch.calories}
Evening Snack: ${plan.dietPlan.eveningSnack.name} - ${
      plan.dietPlan.eveningSnack.calories
    }
Dinner: ${plan.dietPlan.dinner.name} - ${plan.dietPlan.dinner.calories}

Total Daily Calories: ${plan.dietPlan.totalCalories}

=== TIPS ===
${plan.tips.map((tip) => `• ${tip}`).join("\n")}

=== MOTIVATION ===
"${plan.motivation}"
    `.trim();

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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Your Plan is Ready,{" "}
            <span className="gradient-text">{userProfile.name}</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Personalized for your {userProfile.fitnessGoal.replace("-", " ")}{" "}
            journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportToPDF}
            className="gap-2 rounded-xl bg-transparent hover:cursor-pointer !hover:bg-secondary/50"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isLoading}
            className="gap-2 rounded-xl bg-transparent hover:cursor-pointer !hover:bg-secondary/50"
          >
            <RefreshIcon
              className={cn("h-4 w-4", isLoading && "animate-spin")}
            />
            {isLoading ? "Generating..." : "Regenerate (2x Content)"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workout" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14 p-1.5 rounded-full bg-muted border border-border">
          <TabsTrigger
            value="workout"
            className="gap-2 rounded-l-full data-[state=active]:shadow-lg data-[state=active]:shadow-black/10"
          >
            <DumbbellIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Workout</span>
          </TabsTrigger>
          <TabsTrigger
            value="diet"
            className="gap-2 rounded-xs data-[state=active]:shadow-lg data-[state=active]:shadow-black/10"
          >
            <SaladIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Diet</span>
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="gap-2 rounded-r-full data-[state=active]:shadow-lg data-[state=active]:shadow-black/10"
          >
            <SparklesIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Tips</span>
          </TabsTrigger>
        </TabsList>

        {/* Workout Tab */}
        <TabsContent value="workout" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Weekly Workout Plan</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isSpeaking && speakingSection === "workout"
                  ? stopSpeaking()
                  : speakPlan("workout")
              }
              className="gap-2 rounded-xl"
            >
              <VolumeIcon className="h-4 w-4" />
              {isSpeaking && speakingSection === "workout"
                ? "Stop"
                : "Read Aloud"}
            </Button>
          </div>

          <div className="space-y-6">
            {plan.workoutPlan.map((day, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/80 text-accent-foreground font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  {index < plan.workoutPlan.length - 1 && (
                    <div className="w-0.5 h-20 bg-gradient-to-b from-accent/50 to-accent/20 mt-4"></div>
                  )}
                </div>
                <Card className="bg-card border border-border overflow-hidden hover-lift transition-all duration-300 flex-1">
                  <CardHeader className="bg-gradient-to-r from-accent/20 to-transparent pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div>
                          <span className="font-semibold">{day.day}</span>
                          <span className="text-muted-foreground font-normal ml-2">
                            — {day.focus}
                          </span>
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                          <ClockIcon className="h-4 w-4" />
                          {day.duration}
                        </span>
                        <span className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full">
                          <FlameIcon className="h-4 w-4" />
                          {day.caloriesBurned}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {day.exercises.map((exercise, exIndex) => (
                        <button
                          key={exIndex}
                          onClick={() =>
                            setSelectedItem({
                              type: "exercise",
                              name: exercise.name,
                            })
                          }
                          className="group flex items-center justify-between rounded-xl bg-secondary/30 p-4 text-left transition-all duration-200 hover:bg-accent/10 hover:scale-[1.01] w-full"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-sm font-semibold group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                              {exIndex + 1}
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-accent transition-colors">
                                {exercise.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {exercise.sets} sets × {exercise.reps} • Rest:{" "}
                                {exercise.restTime}
                              </p>
                            </div>
                          </div>
                          <SparklesIcon className="h-5 w-5 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Diet Tab */}
        <TabsContent value="diet" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Daily Diet Plan</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isSpeaking && speakingSection === "diet"
                  ? stopSpeaking()
                  : speakPlan("diet")
              }
              className="gap-2 rounded-xl"
            >
              <VolumeIcon className="h-4 w-4" />
              {isSpeaking && speakingSection === "diet" ? "Stop" : "Read Aloud"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Breakfast",
                meal: plan.dietPlan.breakfast,
                time: "7:00 AM",
                emoji: "🌅",
              },
              {
                label: "Mid-Morning Snack",
                meal: plan.dietPlan.midMorningSnack,
                time: "10:00 AM",
                emoji: "🥤",
              },
              {
                label: "Lunch",
                meal: plan.dietPlan.lunch,
                time: "1:00 PM",
                emoji: "☀️",
              },
              {
                label: "Evening Snack",
                meal: plan.dietPlan.eveningSnack,
                time: "4:00 PM",
                emoji: "🍎",
              },
              {
                label: "Dinner",
                meal: plan.dietPlan.dinner,
                time: "7:00 PM",
                emoji: "🌙",
              },
            ].map(({ label, meal, time, emoji }, index) => (
              <Card
                key={index}
                className="glass-card border-0 cursor-pointer hover-lift transition-all duration-300 group"
                onClick={() =>
                  setSelectedItem({ type: "meal", name: meal.name })
                }
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {label}
                        </p>
                        <p className="text-xs text-muted-foreground">{time}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-accent/20 to-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {meal.calories}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {meal.name}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {meal.description}
                  </p>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                      P: {meal.protein}
                    </span>
                    <span className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                      C: {meal.carbs}
                    </span>
                    <span className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium">
                      F: {meal.fats}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card border-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-primary/10" />
            <CardContent className="relative flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                  <FlameIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="font-medium">Total Daily Calories</span>
                  <p className="text-sm text-muted-foreground">
                    Based on your goals
                  </p>
                </div>
              </div>
              <span className="text-3xl font-bold gradient-text">
                {plan.dietPlan.totalCalories}
              </span>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          <h3 className="text-xl font-semibold">AI Tips & Recommendations</h3>
          <div className="grid gap-3">
            {plan.tips.map((tip, index) => (
              <Card
                key={index}
                className="glass-card border-0 hover-lift transition-all duration-300"
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                    <CheckIcon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <p className="text-foreground leading-relaxed">{tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Modal */}
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
