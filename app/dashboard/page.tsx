"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { UserForm } from "@/components/user-form";
import { PlanDisplay } from "@/components/plan-display";
import { LoadingScreen } from "@/components/loading-screen";
import type { UserProfile, FitnessPlan } from "@/lib/types";

type AppState = "hero" | "form" | "loading" | "result";

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>("hero");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function loadSavedPlan() {
      try {
        const response = await fetch("/api/fitness-plan");
        if (response.ok) {
          const data = await response.json();
          if (data && data.profile && data.plan) {
            setUserProfile(data.profile);
            setFitnessPlan(data.plan);
            setAppState("result");
          }
        }
      } catch (error) {
        console.error("Failed to load saved plan:", error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadSavedPlan();
  }, []);

  const handleGetStarted = () => {
    setAppState("form");
  };

  const handleFormSubmit = async (
    profile: UserProfile,
    isRegenerate = false
  ) => {
    setUserProfile(profile);
    setIsLoading(true);

    if (!isRegenerate) {
      setAppState("loading");
    }

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, isRegenerate }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const plan: FitnessPlan = await response.json();
      setFitnessPlan(plan);
      setAppState("result");
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Failed to generate plan. Please try again.");
      if (!isRegenerate) {
        setAppState("form");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (userProfile) {
      await handleFormSubmit(userProfile, true);
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        "Are you sure you want to delete your current plan and build a new profile?"
      )
    ) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/fitness-plan", {
          method: "DELETE",
        });
        if (response.ok) {
          setUserProfile(null);
          setFitnessPlan(null);
          setAppState("form");
        } else {
          alert("Failed to reset plan. Please try again.");
        }
      } catch (error) {
        console.error("Error resetting plan:", error);
        alert("Failed to reset plan. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 px-4 py-6 md:py-10">
        {isInitialLoading ? (
          <LoadingScreen
            message="Checking for saved plans..."
            subtitle="Loading"
          />
        ) : (
          <>
            {appState === "hero" && <HeroSection onGetStarted={handleGetStarted} />}

            {appState === "form" && (
              <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UserForm
                  onSubmit={(profile) => handleFormSubmit(profile, false)}
                  isLoading={isLoading}
                />
              </div>
            )}

            {appState === "loading" && <LoadingScreen />}

            {appState === "result" && fitnessPlan && userProfile && (
              <div className="w-full">
                <PlanDisplay
                  plan={fitnessPlan}
                  userProfile={userProfile}
                  onRegenerate={handleRegenerate}
                  onReset={handleReset}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-auto border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Made and designed by Kirtan Suthar
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Personalized fitness plans to achieve your goals
          </p>
        </div>
      </footer>
    </div>
  );
}
