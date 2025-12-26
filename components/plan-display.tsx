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
    const content = `FitBeat - Plan for ${userProfile.name}`;
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
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-sm text-primary font-semibold uppercase">
          AI Generated Plan
        </p>

        <h2 className="text-3xl font-bold">
          Hi {userProfile.name}, here’s your plan 🎯
        </h2>

        <p className="text-muted-foreground">
          Goal:{" "}
          <span className="font-semibold">
            {userProfile.fitnessGoal.replace("-", " ")}
          </span>
        </p>

        <div className="flex gap-3 justify-center mt-3">
          <Button variant="outline" onClick={exportToPDF}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button onClick={onRegenerate} disabled={isLoading}>
            <RefreshIcon
              className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
            />
            {isLoading ? "Regenerating..." : "Optimize Plan"}
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
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DumbbellIcon className="h-5 w-5" /> Workout Plan
            </h3>

            <Button
              size="sm"
              variant="secondary"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.workoutPlan.map((day, i) => (
              <Card key={i} className="hover:shadow-md transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-red-600/60">
                    {day.day}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{day.focus}</p>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" /> {day.duration}
                    <span>•</span>
                    <FlameIcon className="h-4 w-4 text-primary" />
                    {day.caloriesBurned} kcal
                  </p>

                  <div className="space-y-2">
                    {day.exercises.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setSelectedItem({ type: "exercise", name: ex.name })
                        }
                        className="w-full text-left px-3 py-2 border rounded-lg hover:bg-accent/10 transition text-xs"
                      >
                        <span className="font-semibold">{ex.name}</span>
                        <br />
                        <span className="text-muted-foreground">
                          {ex.sets} Sets • {ex.reps} Reps
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
              <CardTitle className="flex gap-2 items-center">
                <FlameIcon className="h-5 w-5 text-primary" />
                Daily Calories: {plan.dietPlan.totalCalories}
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
                  className="w-full flex justify-between items-center p-3 border rounded-lg hover:bg-accent/10 transition"
                >
                  <span className="font-semibold">{m.label}</span>
                  <span>{m.meal.name}</span>
                </button>
              ))}

              <Button
                variant="secondary"
                onClick={() =>
                  isSpeaking && speakingSection === "diet"
                    ? stopSpeaking()
                    : speakPlan("diet")
                }
              >
                <VolumeIcon className="h-4 w-4 mr-2" />
                {isSpeaking && speakingSection === "diet" ? "Stop" : "Listen"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips */}
        <TabsContent value="tips" className="space-y-4">
          <div className="text-center">
            <QuoteIcon className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="italic text-lg">{plan.motivation}</p>
          </div>

          {plan.tips.map((tip, i) => (
            <Card key={i}>
              <CardContent className="flex gap-2 py-4">
                <CheckIcon className="h-5 w-5 text-primary" />
                <p>{tip}</p>
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
