"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="w-full">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {FORM_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    stepIndex > index
                      ? "bg-accent border-accent text-accent-foreground"
                      : stepIndex === index + 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < FORM_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-12 mx-2 transition-colors duration-300",
                      stepIndex > index + 1
                        ? "bg-accent"
                        : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {FORM_STEPS[stepIndex - 1].title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Step {stepIndex} of 4
          </p>
        </div>
      </div>

      <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/20 dark:from-muted dark:via-muted dark:to-muted/30 shadow-xl rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 dark:from-accent/10 dark:to-primary/10" />

        <CardContent className="relative p-6 md:p-8 space-y-8">
          {/* Step 1 */}
          {stepIndex === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Basic Information</h2>
                <p className="text-muted-foreground">
                  Tell us a little about you
                </p>
              </div>

              <div className="grid gap-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">Age</Label>
                    <Input
                      type="number"
                      value={formData.age || ""}
                      onChange={(e) =>
                        updateFormData({ age: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2">Gender</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["male", "female", "other"] as const).map((gender) => (
                        <button
                          key={gender}
                          onClick={() => updateFormData({ gender })}
                          className={cn(
                            "rounded-md border px-3 py-2 text-sm capitalize transition-all",
                            formData.gender === gender
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50"
                          )}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {stepIndex === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Body Stats</h2>
                <p className="text-muted-foreground">
                  Helps personalize accuracy
                </p>
              </div>

              <div className="grid gap-6 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">Height (cm)</Label>
                    <Input
                      type="number"
                      value={formData.height || ""}
                      onChange={(e) =>
                        updateFormData({ height: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2">Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.weight || ""}
                      onChange={(e) =>
                        updateFormData({ weight: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2">Sleep Hours</Label>
                  <Input
                    type="number"
                    value={formData.sleepHours || ""}
                    onChange={(e) =>
                      updateFormData({
                        sleepHours: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {stepIndex === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Your Goals</h2>
                <p className="text-muted-foreground">
                  What are you aiming for?
                </p>
              </div>

              <div className="grid gap-6 max-w-lg mx-auto">
                <div>
                  <Label>Primary Goal</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {[
                      { id: "weight-loss", label: "Weight Loss" },
                      { id: "muscle-gain", label: "Muscle Gain" },
                      { id: "maintenance", label: "Maintenance" },
                    ].map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() =>
                          updateFormData({
                            fitnessGoal: goal.id as any,
                          })
                        }
                        className={cn(
                          "rounded-lg border px-4 py-3 text-sm transition-all",
                          formData.fitnessGoal === goal.id
                            ? "bg-accent text-accent-foreground shadow-md"
                            : "hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50"
                        )}
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {stepIndex === 4 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Preferences</h2>
                <p className="text-muted-foreground">
                  Final personalization details
                </p>
              </div>

              <div className="grid gap-6 max-w-lg mx-auto">
                <div>
                  <Label>Workout Location</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { id: "home", label: "Home" },
                      { id: "gym", label: "Gym" },
                      { id: "outdoor", label: "Outdoor" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          updateFormData({
                            workoutLocation: opt.id as any,
                          })
                        }
                        className={cn(
                          "rounded-lg border px-4 py-3 text-sm transition-all",
                          formData.workoutLocation === opt.id
                            ? "bg-accent text-accent-foreground shadow-md"
                            : "hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="ghost"
              disabled={stepIndex === 1}
              onClick={goToPreviousStep}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Button>

            {stepIndex < 4 ? (
              <Button
                onClick={goToNextStep}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
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
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Generate Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
