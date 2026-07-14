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
  DownloadIcon,
  RefreshIcon,
  CheckIcon,
  QuoteIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { ImageModal } from "@/components/image-modal";
import { ExerciseModal } from "@/components/exercise-modal";
import { WorkoutTab } from "@/components/workout-tab";
import { DietTab } from "@/components/diet-tab";

interface PlanDisplayProps {
  planId?: string | null;
  plan: FitnessPlan;
  userProfile: UserProfile;
  onRegenerate: () => void;
  isLoading: boolean;
  onReset?: () => void;
}

export function PlanDisplay({
  planId,
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
    data: any;
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
        <TabsContent value="workout" className="space-y-4">
          <WorkoutTab
            planId={planId}
            plan={plan}
            isSpeaking={isSpeaking}
            speakingSection={speakingSection}
            onSpeak={() => speakPlan("workout")}
            onStopSpeak={stopSpeaking}
            onSelectItem={(type, data) => setSelectedItem({ type, data })}
          />
        </TabsContent>

        {/* Diet */}
        <TabsContent value="diet" className="space-y-4">
          <DietTab
            plan={plan}
            isSpeaking={isSpeaking}
            speakingSection={speakingSection}
            onSpeak={() => speakPlan("diet")}
            onStopSpeak={stopSpeaking}
            onSelectItem={(type, data) => setSelectedItem({ type, data })}
          />
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

      {selectedItem?.type === "meal" && (
        <ImageModal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          itemName={selectedItem.data.name}
          itemType="meal"
        />
      )}
      <ExerciseModal
        exercise={selectedItem?.type === "exercise" ? selectedItem.data : null}
        isOpen={selectedItem?.type === "exercise"}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
