"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlameIcon, VolumeIcon, RefreshIcon, LoaderIcon } from "@/components/icons";
import { ImageWithFallback } from "@/components/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FitnessPlan } from "@/lib/types";

interface DietTabProps {
  plan: FitnessPlan;
  isSpeaking: boolean;
  speakingSection: string | null;
  onSpeak: () => void;
  onStopSpeak: () => void;
  onSelectItem: (type: "exercise" | "meal", data: any, meta?: string) => void;
  onSwapMeal?: (mealType: string, preference: "veg" | "non-veg") => Promise<void>;
}

export function DietTab({
  plan,
  isSpeaking,
  speakingSection,
  onSpeak,
  onStopSpeak,
  onSelectItem,
  onSwapMeal,
}: DietTabProps) {
  const [swappingMealType, setSwappingMealType] = useState<string | null>(null);

  if (!plan.dietPlan || Object.keys(plan.dietPlan).length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-border">
        No diet plan data was generated. Please try regenerating your plan.
      </div>
    );
  }

  const handleSwap = async (mealType: string, preference: "veg" | "non-veg", e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening the image modal
    if (!onSwapMeal) return;
    try {
      setSwappingMealType(mealType);
      await onSwapMeal(mealType, preference);
    } finally {
      setSwappingMealType(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
            Daily target
          </p>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <FlameIcon className="h-5 w-5 text-primary" />
            {plan.dietPlan?.totalCalories || "Not specified"} kcal
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {[
            { label: "Breakfast", key: "breakfast", meal: plan.dietPlan?.breakfast },
            { label: "Lunch", key: "lunch", meal: plan.dietPlan?.lunch },
            { label: "Dinner", key: "dinner", meal: plan.dietPlan?.dinner },
          ]
            .filter((m) => m.meal && m.meal.name)
            .map((m, i) => (
              <div
                key={i}
                className="flex w-full items-center gap-4 rounded-xl border border-border bg-secondary/30 p-3 transition hover:border-primary/40 hover:bg-secondary text-left group overflow-hidden relative cursor-pointer"
                onClick={() => onSelectItem("meal", m.meal, m.key)}
              >
                {swappingMealType === m.key && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                    <LoaderIcon className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 font-medium text-sm text-primary">Finding alternative...</span>
                  </div>
                )}
                
                {/* Preload full-size modal image in background */}
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(
                    `${m.meal?.name || ""}, delicious healthy food, professional food photography, high quality, appetizing`
                  )}?width=512&height=512&nologo=true`}
                  className="hidden"
                  alt="preload"
                />
                
                <div className="flex flex-col justify-center flex-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </span>
                  <span className="font-medium text-lg">{m.meal?.name}</span>
                </div>
                
                <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity pr-10">
                  View details &gt;
                </span>
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20">
                        <RefreshIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleSwap(m.key, "veg", e as any)}>
                        Swap to Veg
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleSwap(m.key, "non-veg", e as any)}>
                        Swap to Non-Veg
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              isSpeaking && speakingSection === "diet" ? onStopSpeak() : onSpeak()
            }
          >
            <VolumeIcon className="mr-2 h-4 w-4" />
            {isSpeaking && speakingSection === "diet" ? "Stop" : "Listen"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
