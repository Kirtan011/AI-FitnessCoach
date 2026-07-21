"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserForm } from "@/components/user-form";
import { LoadingScreen } from "@/components/loading-screen";
import { Header } from "@/components/header";
import type { UserProfile } from "@/lib/types";
import { usePlanStore } from "@/hooks/use-plan-store";
import { useTargetMuscleStore } from "@/hooks/use-target-muscle-store";

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUserProfile } = usePlanStore();
  const { setMiniPlan, setTargetMuscles } = useTargetMuscleStore();

  const handleFormSubmit = async (profile: UserProfile) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, isRegenerate: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }
      
      setUserProfile(profile);
      setMiniPlan(null);
      setTargetMuscles([]);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Failed to generate plan. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 px-4 py-6 md:py-10">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex flex-col items-center justify-center text-center">
              <div className="h-40 mb-6 relative w-full max-w-[320px]">
                <Image src="/clipart/undraw_fitness-tracker_iedm.svg" alt="Fitness Tracker" fill className="object-contain opacity-90 drop-shadow-sm" />
              </div>
              <h1 className="text-3xl font-display font-bold">Build Your Profile</h1>
              <p className="text-muted-foreground mt-2 max-w-md">Let's personalize your fitness plan by understanding your goals, experience, and lifestyle.</p>
            </div>
            <UserForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
