"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PlanDisplay } from "@/components/plan-display";
import { LoadingScreen } from "@/components/loading-screen";
import { DashboardOverview } from "@/components/dashboard-overview";
import type { UserProfile, FitnessPlan } from "@/lib/types";

function DashboardPageContent() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadSavedPlan() {
      try {
        setIsInitialLoading(true);
        const idParam = searchParams.get("planId");
        const url = idParam ? `/api/fitness-plan?id=${idParam}` : "/api/fitness-plan";
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.profile && data.plan && data.id) {
            setUserProfile(data.profile);
            setFitnessPlan(data.plan);
            setPlanId(data.id);
            
            // Also fetch stats
            fetch("/api/stats").then(res => res.json()).then(statsData => {
              setStats(statsData);
            }).catch(console.error);
            
          } else {
            router.push("/onboarding");
          }
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Failed to load saved plan:", error);
        router.push("/onboarding");
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadSavedPlan();
  }, [router, searchParams]);

  const handleRegenerate = async (updatedProfile?: UserProfile) => {
    const profileToUse = updatedProfile || userProfile;
    if (profileToUse) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: profileToUse, isRegenerate: true }),
        });

        if (!response.ok) throw new Error("Failed to regenerate");

        const planData = await response.json();
        // planData contains { id, warmup, workoutPlan, cooldown, dietPlan, motivation, tips }
        setFitnessPlan(planData);
        setPlanId(planData.id);
        if (updatedProfile) {
          setUserProfile(updatedProfile);
        }
      } catch (error) {
        console.error("Error generating plan:", error);
        alert("Failed to regenerate plan. Please try again.");
      } finally {
        setIsLoading(false);
      }
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
          router.push("/onboarding");
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

  const handleSwapMeal = async (mealType: string, preference: "veg" | "non-veg") => {
    if (!fitnessPlan || !fitnessPlan.dietPlan) return;
    const currentMeal = (fitnessPlan.dietPlan as any)[mealType];
    if (!currentMeal) return;

    try {
      const response = await fetch("/api/swap-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          mealType,
          currentMeal,
          preference,
        }),
      });

      if (!response.ok) throw new Error("Failed to swap meal");

      const data = await response.json();
      if (data.updatedPlan) {
        setFitnessPlan(data.updatedPlan);
      } else if (data.meal) {
        // Optimistic / local update if DB update failed or no user session
        setFitnessPlan((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          if (updated.dietPlan) {
            (updated.dietPlan as any)[mealType] = data.meal;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error swapping meal:", error);
      alert("Failed to swap meal. Please try again.");
    }
  };

  if (isInitialLoading) {
    return <LoadingScreen message="Loading your plan..." subtitle="Dashboard" />;
  }

  if (isLoading) {
    return <LoadingScreen message="Regenerating your plan..." subtitle="Dashboard" />;
  }

  if (!fitnessPlan || !userProfile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500 space-y-8 pb-12">
      <DashboardOverview stats={stats} />
      
      <PlanDisplay
        planId={planId}
        plan={fitnessPlan}
        userProfile={userProfile}
        onRegenerate={handleRegenerate}
        onReset={handleReset}
        isLoading={isLoading}
        onSwapMeal={handleSwapMeal}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading your plan..." subtitle="Dashboard" />}>
      <DashboardPageContent />
    </Suspense>
  );
}
