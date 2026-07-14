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
  onReset?: () => void;
}

export function PlanDisplay({
  plan,
  userProfile,
  onRegenerate,
  isLoading,
  onReset,
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
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    let text = "";

    if (section === "workout") {
      text = `Here is your workout plan. ${plan.workoutPlan
        .map(
          (day) =>
            `${day.day}: ${day.focus}. ${day.exercises
              .map((e) => `${e.name}, ${e.sets} sets of ${e.reps}`)
              .join(". ")}`
        )
        .join(". ")}`;
    } else {
      text = `Here is your diet plan. Breakfast: ${plan.dietPlan.breakfast.name}. Lunch: ${plan.dietPlan.lunch.name}. Dinner: ${plan.dietPlan.dinner.name}. Total calories ${plan.dietPlan.totalCalories}`;
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
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingSection(null);
  };

  const exportToPDF = () => {
    const content = `FitChamp - Plan for ${userProfile.name}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FitChamp-plan-${userProfile.name
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16">
      {/* Header */}
      <div className="space-y-3 text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-primary">
          AI-generated plan
        </p>

        <h2 className="font-display text-3xl font-bold tracking-tight">
          Hi {userProfile.name}, here&rsquo;s your plan
        </h2>

        <p className="text-muted-foreground">
          Goal:{" "}
          <span className="font-medium capitalize text-foreground">
            {userProfile.fitnessGoal.replace("-", " ")}
          </span>
        </p>

        <div className="mt-3 flex justify-center gap-3">
          {onReset && (
            <Button variant="ghost" onClick={onReset} disabled={isLoading}>
              New Plan
            </Button>
          )}

          <Button variant="outline" onClick={exportToPDF}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button onClick={onRegenerate} disabled={isLoading}>
            <RefreshIcon
              className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
            />
            {isLoading ? "Regenerating…" : "Optimize Plan"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workout">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="workout" className="gap-2">
            <DumbbellIcon className="h-4 w-4" /> Workout
          </TabsTrigger>

          <TabsTrigger value="diet" className="gap-2">
            <SaladIcon className="h-4 w-4" /> Diet
          </TabsTrigger>

          <TabsTrigger value="tips" className="gap-2">
            <SparklesIcon className="h-4 w-4" /> Tips
          </TabsTrigger>
        </TabsList>

        {/* Workout */}
        {/* Workout */}
        <TabsContent value="workout" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <DumbbellIcon className="h-5 w-5 text-primary" /> Workout Plan
            </h3>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                isSpeaking && speakingSection === "workout"
                  ? stopSpeaking()
                  : speakPlan("workout")
              }
            >
              <VolumeIcon className="h-4 w-4 mr-1" />
              {isSpeaking && speakingSection === "workout" ? "Stop" : "Listen"}
            </Button>
          </div>

          {/* GRID LAYOUT HERE */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plan.workoutPlan.map((day, i) => (
              <Card key={i} className="hover-lift gap-3">
                <CardHeader className="pb-0">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                    {day.day}
                  </p>
                  <CardTitle className="font-display text-lg">
                    {day.focus}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <ClockIcon className="h-3.5 w-3.5" /> {day.duration}
                    <span className="text-border">|</span>
                    <FlameIcon className="h-3.5 w-3.5 text-primary" />
                    {day.caloriesBurned} kcal
                  </p>

                  <div className="space-y-2">
                    {day.exercises.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setSelectedItem({ type: "exercise", name: ex.name })
                        }
                        className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-secondary"
                      >
                        <span className="font-semibold">{ex.name}</span>
                        <br />
                        <span className="font-mono text-muted-foreground">
                          {ex.sets} sets · {ex.reps} reps
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Diet */}
        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                Daily target
              </p>
              <CardTitle className="flex items-center gap-2 font-display text-xl">
                <FlameIcon className="h-5 w-5 text-primary" />
                {plan.dietPlan.totalCalories} kcal
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                { label: "Breakfast", meal: plan.dietPlan.breakfast },
                { label: "Lunch", meal: plan.dietPlan.lunch },
                { label: "Dinner", meal: plan.dietPlan.dinner },
              ].map((m, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setSelectedItem({ type: "meal", name: m.meal.name })
                  }
                  className="flex w-full items-center justify-between rounded-md border border-border bg-secondary/30 p-3 transition hover:border-primary/40 hover:bg-secondary"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </span>
                  <span className="font-medium">{m.meal.name}</span>
                </button>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  isSpeaking && speakingSection === "diet"
                    ? stopSpeaking()
                    : speakPlan("diet")
                }
              >
                <VolumeIcon className="mr-2 h-4 w-4" />
                {isSpeaking && speakingSection === "diet" ? "Stop" : "Listen"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips */}
        <TabsContent value="tips" className="space-y-4">
          <div className="mx-auto max-w-2xl text-center">
            <QuoteIcon className="mx-auto mb-3 h-6 w-6 text-primary" />
            <p className="font-display text-lg italic">{plan.motivation}</p>
          </div>

          {plan.tips.map((tip, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-3 py-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm">{tip}</p>
              </CardContent>
            </Card>
          ))}
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
