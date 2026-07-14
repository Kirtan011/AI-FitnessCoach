"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Framed, SectionTag } from "@/components/shared";
import type { UserProfile } from "@/lib/types";
import {
  UserIcon,
  ScaleIcon,
  TargetIcon,
  ActivityIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DumbbellIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface UserFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const FORM_STEPS = [
  { id: 1, title: "Basic Info", icon: UserIcon },
  { id: 2, title: "Goals & Exp", icon: TargetIcon },
  { id: 3, title: "Equipment", icon: DumbbellIcon },
  { id: 4, title: "Workout Details", icon: ActivityIcon },
  { id: 5, title: "Limitations", icon: ScaleIcon },
];

const EQUIPMENT_OPTIONS = [
  { id: "bodyweight", label: "Bodyweight", emoji: "💪" },
  { id: "dumbbell", label: "Dumbbell", emoji: "🏋️‍♂️" },
  { id: "barbell", label: "Barbell", emoji: "🏋️‍♀️" },
  { id: "kettlebell", label: "Kettlebell", emoji: "🖲️" },
  { id: "band", label: "Band", emoji: "〰️" },
  { id: "plate", label: "Plate", emoji: "💿" },
  { id: "pull-up-bar", label: "Pull-up bar", emoji: "⛩️" },
  { id: "bench", label: "Bench", emoji: "💺" },
];

const MUSCLE_GROUPS = [
  { id: "full-body", label: "Full Body" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "legs", label: "Legs" },
  { id: "arms", label: "Arms" },
  { id: "core", label: "Core" },
  { id: "shoulders", label: "Shoulders" },
];

const WORKOUT_SPLITS = [
  { id: "full-body", label: "Full Body (3x/week)" },
  { id: "upper-lower", label: "Upper/Lower (4x/week)" },
  { id: "ppl", label: "Push/Pull/Legs (6x/week)" },
  { id: "bro-split", label: "Bro Split (5x/week)" },
  { id: "custom", label: "AI Optimized" },
];

const DURATIONS = [
  { id: "30-min", label: "30 Minutes" },
  { id: "45-min", label: "45 Minutes" },
  { id: "60-min", label: "60 Minutes" },
  { id: "90-min", label: "90+ Minutes" },
];

function OptionButton({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-4 py-3 text-sm font-medium transition-all text-center",
        active
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary",
        className
      )}
    >
      {children}
    </button>
  );
}

function MultiSelectOption({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-md border px-4 py-3 text-sm font-medium transition-all text-left flex flex-col items-center justify-center",
        active
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary",
        className
      )}
    >
      {active && (
        <div className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground p-0.5">
          <Check className="h-3 w-3" />
        </div>
      )}
      {children}
    </button>
  );
}

export function UserForm({ onSubmit, isLoading }: UserFormProps) {
  const [stepIndex, setStepIndex] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: "male",
    fitnessGoal: "weight-loss",
    fitnessLevel: "beginner",
    workoutLocation: "gym",
    dietaryPreference: "non-veg",
    stressLevel: "medium",
    equipment: [],
    targetMuscles: [],
    workoutSplit: "custom",
    targetDuration: "45-min",
  });

  const goToNextStep = () => {
    // Skip equipment step if not home workout
    if (stepIndex === 2 && formData.workoutLocation === "gym") {
      setStepIndex(4);
    } else if (stepIndex < 5) {
      setStepIndex(stepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    // Skip equipment step if not home workout
    if (stepIndex === 4 && formData.workoutLocation === "gym") {
      setStepIndex(2);
    } else if (stepIndex > 1) {
      setStepIndex(stepIndex - 1);
    }
  };

  const submitFormData = () => {
    if (formData.name && formData.age && formData.height && formData.weight) {
      // If gym, assume all equipment
      const finalData = { ...formData };
      if (finalData.workoutLocation === "gym") {
        finalData.equipment = ["fully-equipped-gym"];
      }
      onSubmit(finalData as UserProfile);
    }
  };

  const updateFormData = (updates: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleEquipment = (id: string) => {
    const current = formData.equipment || [];
    if (current.includes(id)) {
      updateFormData({ equipment: current.filter((e) => e !== id) });
    } else {
      updateFormData({ equipment: [...current, id] });
    }
  };

  const toggleMuscle = (id: string) => {
    const current = formData.targetMuscles || [];
    if (current.includes(id)) {
      updateFormData({ targetMuscles: current.filter((e) => e !== id) });
    } else {
      updateFormData({ targetMuscles: [...current, id] });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Stepper */}
      <div>
        <div className="flex items-center justify-center">
          {FORM_STEPS.map((step, index) => {
            const done = stepIndex > step.id;
            const current = stepIndex === step.id;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-md border transition-all duration-300",
                    done && "border-primary bg-primary text-primary-foreground",
                    current && "border-primary bg-primary/10 text-primary",
                    !done && !current &&
                      "border-border text-muted-foreground"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < FORM_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-6 sm:w-10 transition-colors duration-300",
                      stepIndex > index + 1 ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Step {stepIndex} / 5
          </p>
          <h3 className="mt-1 font-display text-lg font-bold">
            {FORM_STEPS.find((s) => s.id === stepIndex)?.title}
          </h3>
        </div>
      </div>

      <Framed className="rounded-lg shadow-sm">
        <div className="p-6 md:p-8">
          <SectionTag
            label={FORM_STEPS.find((s) => s.id === stepIndex)?.title || ""}
            index={stepIndex}
            total={5}
          />

          <div className="mt-8 space-y-8">
            {/* Step 1: Basic Info */}
            {stepIndex === 1 && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={formData.age || ""}
                      onChange={(e) =>
                        updateFormData({ age: Number(e.target.value) })
                      }
                      placeholder="e.g. 27"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["male", "female", "other"] as const).map((gender) => (
                        <OptionButton
                          key={gender}
                          active={formData.gender === gender}
                          onClick={() => updateFormData({ gender })}
                          className="px-2 py-2 capitalize"
                        >
                          {gender}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      value={formData.height || ""}
                      onChange={(e) =>
                        updateFormData({ height: Number(e.target.value) })
                      }
                      placeholder="e.g. 175"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.weight || ""}
                      onChange={(e) =>
                        updateFormData({ weight: Number(e.target.value) })
                      }
                      placeholder="e.g. 72"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals & Experience */}
            {stepIndex === 2 && (
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label>Primary Goal</Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { id: "weight-loss", label: "Weight Loss" },
                      { id: "muscle-gain", label: "Muscle Gain" },
                      { id: "maintenance", label: "Maintenance" },
                      { id: "endurance", label: "Endurance" },
                    ].map((goal) => (
                      <OptionButton
                        key={goal.id}
                        active={formData.fitnessGoal === goal.id}
                        onClick={() =>
                          updateFormData({ fitnessGoal: goal.id as any })
                        }
                      >
                        {goal.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Experience Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "beginner", label: "Beginner" },
                      { id: "intermediate", label: "Intermediate" },
                      { id: "advanced", label: "Advanced" },
                    ].map((level) => (
                      <OptionButton
                        key={level.id}
                        active={formData.fitnessLevel === level.id}
                        onClick={() =>
                          updateFormData({ fitnessLevel: level.id as any })
                        }
                      >
                        {level.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Workout Location</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "home", label: "Home (Select Equipment)" },
                      { id: "gym", label: "Gym (Fully Equipped)" },
                    ].map((opt) => (
                      <OptionButton
                        key={opt.id}
                        active={formData.workoutLocation === opt.id}
                        onClick={() =>
                          updateFormData({ workoutLocation: opt.id as any })
                        }
                      >
                        {opt.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Equipment (Home only) */}
            {stepIndex === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-medium text-foreground italic">
                    Select the equipment you have available.
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {EQUIPMENT_OPTIONS.map((item) => (
                    <MultiSelectOption
                      key={item.id}
                      active={(formData.equipment || []).includes(item.id)}
                      onClick={() => toggleEquipment(item.id)}
                      className="py-6 gap-3"
                    >
                      <span className="text-4xl">{item.emoji}</span>
                      <span className="text-sm">{item.label}</span>
                    </MultiSelectOption>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Workout Details */}
            {stepIndex === 4 && (
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label>Target Muscle Groups</Label>
                  <div className="flex flex-wrap gap-2">
                    {MUSCLE_GROUPS.map((muscle) => (
                      <MultiSelectOption
                        key={muscle.id}
                        active={(formData.targetMuscles || []).includes(muscle.id)}
                        onClick={() => toggleMuscle(muscle.id)}
                        className="py-2 px-4 w-auto flex-row gap-2"
                      >
                        {muscle.label}
                      </MultiSelectOption>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Workout Split</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WORKOUT_SPLITS.map((split) => (
                      <OptionButton
                        key={split.id}
                        active={formData.workoutSplit === split.id}
                        onClick={() => updateFormData({ workoutSplit: split.id })}
                      >
                        {split.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Target Duration</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DURATIONS.map((duration) => (
                      <OptionButton
                        key={duration.id}
                        active={formData.targetDuration === duration.id}
                        onClick={() => updateFormData({ targetDuration: duration.id })}
                      >
                        {duration.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Limitations */}
            {stepIndex === 5 && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label>Injuries or Limitations (Optional)</Label>
                  <Input
                    value={formData.injuries || ""}
                    onChange={(e) => updateFormData({ injuries: e.target.value })}
                    placeholder="e.g. Bad lower back, shoulder impingement..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Our AI will avoid exercises that aggravate these areas and suggest safe alternatives.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Dietary Preference</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["veg", "non-veg", "vegan", "keto"] as const).map((diet) => (
                      <OptionButton
                        key={diet}
                        active={formData.dietaryPreference === diet}
                        onClick={() => updateFormData({ dietaryPreference: diet })}
                        className="px-2 py-2 capitalize"
                      >
                        {diet}
                      </OptionButton>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stress Level</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <OptionButton
                          key={level}
                          active={formData.stressLevel === level}
                          onClick={() => updateFormData({ stressLevel: level as any })}
                          className="px-2 py-2 capitalize"
                        >
                          {level}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sleep Hours</Label>
                    <Input
                      type="number"
                      value={formData.sleepHours || ""}
                      onChange={(e) =>
                        updateFormData({ sleepHours: Number(e.target.value) })
                      }
                      placeholder="e.g. 7"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="ghost"
              disabled={stepIndex === 1}
              onClick={goToPreviousStep}
            >
              <ChevronLeftIcon className="mr-1 h-4 w-4" />
              Back
            </Button>

            {stepIndex < 5 ? (
              <Button onClick={goToNextStep}>
                Next
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={submitFormData}
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.age ||
                  !formData.height ||
                  !formData.weight
                }
              >
                {isLoading ? "Generating…" : "Generate Plan"}
              </Button>
            )}
          </div>
        </div>
      </Framed>
    </div>
  );
}
