"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlameIcon, VolumeIcon } from "@/components/icons";
import type { FitnessPlan } from "@/lib/types";

interface DietTabProps {
  plan: FitnessPlan;
  isSpeaking: boolean;
  speakingSection: string | null;
  onSpeak: () => void;
  onStopSpeak: () => void;
  onSelectItem: (type: "exercise" | "meal", data: any) => void;
}

export function DietTab({
  plan,
  isSpeaking,
  speakingSection,
  onSpeak,
  onStopSpeak,
  onSelectItem,
}: DietTabProps) {
  return (
    <div className="space-y-4">
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
              onClick={() => onSelectItem("meal", { name: m.meal.name })}
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
                ? onStopSpeak()
                : onSpeak()
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
