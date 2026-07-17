"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { PlanHeader } from "./plan-header";
import { MealModal } from "@/components/meal-modal";
import { ExerciseModal } from "@/components/exercise-modal";
import { WorkoutTab } from "@/components/workout-tab";
import { DietTab } from "@/components/diet-tab";
import { DotGrid, Highlight, Pill } from "@/components/shared";
import { generateFitnessPlanPDF } from "@/lib/pdf-export";

interface PlanDisplayProps {
  planId?: string | null;
  plan: FitnessPlan;
  userProfile: UserProfile;
  onRegenerate: () => void;
  isLoading: boolean;
  onReset?: () => void;
  onSwapMeal?: (mealType: string, preference: "veg" | "non-veg") => Promise<void>;
}

export function PlanDisplay({
  planId,
  plan,
  userProfile,
  onRegenerate,
  isLoading,
  onReset,
  onSwapMeal,
}: PlanDisplayProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSection, setSpeakingSection] = useState<
    "workout" | "diet" | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: "exercise" | "meal";
    data: any;
    meta?: string;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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
      text = `Here is your diet plan. Breakfast: ${plan.dietPlan?.breakfast?.name || 'Not provided'}. Lunch: ${plan.dietPlan?.lunch?.name || 'Not provided'}. Dinner: ${plan.dietPlan?.dinner?.name || 'Not provided'}. Total calories ${plan.dietPlan?.totalCalories || 'Not provided'}`;
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

  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      // Brief timeout to allow UI to update to loading state
      await new Promise(resolve => setTimeout(resolve, 50));
      generateFitnessPlanPDF(plan, userProfile);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <DotGrid className="absolute inset-0 z-0 opacity-40 dark:opacity-20" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-12 px-4 pt-12 pb-24">
        {/* Compact Modern Header & Tips */}
        <div className="flex flex-col gap-8 w-full">
          {/* Top Row: Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
            <div className="space-y-3">
              <Pill>AI-generated plan</Pill>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                Hi {userProfile.name}, here's your <Highlight>plan</Highlight>
              </h2>
              <p className="text-muted-foreground flex items-center gap-2">
                Goal: <span className="font-semibold capitalize text-foreground">{userProfile.fitnessGoal.replace("-", " ")}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto font-medium shadow-sm" onClick={exportToPDF} disabled={isExporting}>
                {isExporting ? (
                  <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <DownloadIcon className="mr-2 h-4 w-4" />
                )}
                {isExporting ? "Exporting..." : "Export"}
              </Button>
              <Button 
                className="w-full md:w-auto font-bold shadow-sm" 
                onClick={onRegenerate} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SparklesIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Optimizing..." : "AI Optimize Plan"}
              </Button>
            </div>
          </div>

          {/* Motivation & Tips Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1 bg-primary/10 rounded-3xl p-6 border border-primary/20 flex flex-col justify-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[40px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
              <QuoteIcon className="mb-3 h-7 w-7 text-primary/80" />
              <p className="font-display text-[15px] font-medium leading-relaxed text-foreground/90 italic relative z-10">
                "{plan.motivation}"
              </p>
            </div>
            
            {plan.tips && plan.tips.length > 0 && (
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-3">
                {plan.tips.slice(0, 4).map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-secondary/30 backdrop-blur-sm rounded-3xl border border-border/50 hover:border-primary/30 transition-all shadow-sm group">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-sm font-medium leading-snug text-muted-foreground group-hover:text-foreground transition-colors">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Main Workout Focus */}
      <WorkoutTab
        planId={planId}
        plan={plan}
        isSpeaking={isSpeaking}
        speakingSection={speakingSection}
        onSpeak={() => speakPlan("workout")}
        onStopSpeak={stopSpeaking}
        onSelectItem={(type, data) => setSelectedItem({ type, data })}
      />

      <div className="pt-8">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="diet" className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="hover:no-underline font-display text-lg font-bold">
              <span className="flex items-center gap-2"><SaladIcon className="h-5 w-5 text-green-500" /> Diet & Nutrition Plan</span>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <DietTab
                plan={plan}
                isSpeaking={isSpeaking}
                speakingSection={speakingSection}
                onSpeak={() => speakPlan("diet")}
                onStopSpeak={stopSpeaking}
                onSelectItem={(type, data, meta) => setSelectedItem({ type, data, meta })}
                onSwapMeal={onSwapMeal}
              />
            </AccordionContent>
          </AccordionItem>


        </Accordion>
      </div>

      <MealModal
        meal={selectedItem?.type === "meal" && selectedItem.meta && plan.dietPlan ? (plan.dietPlan as any)[selectedItem.meta] : null}
        mealType={selectedItem?.type === "meal" ? (selectedItem.meta || null) : null}
        isOpen={selectedItem?.type === "meal"}
        onClose={() => setSelectedItem(null)}
        onSwapMeal={onSwapMeal}
      />
      <ExerciseModal
        exercise={selectedItem?.type === "exercise" ? selectedItem.data : null}
        isOpen={selectedItem?.type === "exercise"}
        onClose={() => setSelectedItem(null)}
      />
      </div>
    </div>
  );
}
