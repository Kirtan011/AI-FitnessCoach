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
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface UserFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const FORM_STEPS = [
  { id: 1, title: "Basic Info", icon: UserIcon },
  { id: 2, title: "Body Stats", icon: ScaleIcon },
  { id: 3, title: "Goals", icon: TargetIcon },
  { id: 4, title: "Preferences", icon: ActivityIcon },
];

/** Selectable option chip used across every step. */
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
        "rounded-md border px-4 py-3 text-sm font-medium capitalize transition-all",
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

export function UserForm({ onSubmit, isLoading }: UserFormProps) {
  const [stepIndex, setStepIndex] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: "male",
    fitnessGoal: "weight-loss",
    fitnessLevel: "beginner",
    workoutLocation: "gym",
    dietaryPreference: "non-veg",
    stressLevel: "medium",
  });

  const goToNextStep = () => {
    if (stepIndex < 4) setStepIndex(stepIndex + 1);
  };

  const goToPreviousStep = () => {
    if (stepIndex > 1) setStepIndex(stepIndex - 1);
  };

  const submitFormData = () => {
    if (formData.name && formData.age && formData.height && formData.weight) {
      onSubmit(formData as UserProfile);
    }
  };

  const updateFormData = (updates: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Stepper */}
      <div>
        <div className="flex items-center justify-center">
          {FORM_STEPS.map((step, index) => {
            const done = stepIndex > index + 1;
            const current = stepIndex === index + 1;
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
                      "mx-2 h-0.5 w-10 transition-colors duration-300 sm:w-14",
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
            Step {stepIndex} / 4
          </p>
          <h3 className="mt-1 font-display text-lg font-bold">
            {FORM_STEPS[stepIndex - 1].title}
          </h3>
        </div>
      </div>

      <Framed className="rounded-lg shadow-sm">
        <div className="p-6 md:p-8">
          <SectionTag
            label={FORM_STEPS[stepIndex - 1].title}
            index={stepIndex}
            total={4}
          />

          <div className="mt-8 space-y-8">
            {/* Step 1 */}
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
                          className="px-2 py-2"
                        >
                          {gender}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {stepIndex === 2 && (
              <div className="grid gap-6">
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
            )}

            {/* Step 3 */}
            {stepIndex === 3 && (
              <div className="space-y-3">
                <Label>Primary Goal</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { id: "weight-loss", label: "Weight Loss" },
                    { id: "muscle-gain", label: "Muscle Gain" },
                    { id: "maintenance", label: "Maintenance" },
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
            )}

            {/* Step 4 */}
            {stepIndex === 4 && (
              <div className="space-y-3">
                <Label>Workout Location</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "home", label: "Home" },
                    { id: "gym", label: "Gym" },
                    { id: "outdoor", label: "Outdoor" },
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

            {stepIndex < 4 ? (
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
