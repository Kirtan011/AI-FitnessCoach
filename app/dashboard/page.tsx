"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PlanDisplay } from "@/components/plan-display";
import { LoadingScreen } from "@/components/loading-screen";
import { DashboardOverview } from "@/components/dashboard-overview";
import type { UserProfile } from "@/lib/types";
import { usePlanStore } from "@/hooks/use-plan-store";
import { useProgressStore } from "@/hooks/use-progress-store";

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    userProfile,
    fitnessPlan,
    planId,
    isLoading,
    isInitialLoading,
    fetchFitnessPlan,
    regeneratePlan,
    resetPlan,
    swapMeal,
  } = usePlanStore();

  const { stats, fetchStats } = useProgressStore();

  useEffect(() => {
    async function loadData() {
      const idParam = searchParams.get("planId");
      const success = await fetchFitnessPlan(idParam);
      if (!success) {
        router.push("/onboarding");
      } else {
        fetchStats();
      }
    }
    loadData();
  }, [router, searchParams, fetchFitnessPlan, fetchStats]);

  const handleRegenerate = async (updatedProfile?: UserProfile) => {
    const success = await regeneratePlan(updatedProfile);
    if (!success) {
      alert("Failed to regenerate plan. Please try again.");
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to delete your current plan and build a new profile?")) {
      const success = await resetPlan();
      if (success) {
        router.push("/onboarding");
      } else {
        alert("Failed to reset plan. Please try again.");
      }
    }
  };

  const handleSwapMeal = async (mealType: string, preference: "veg" | "non-veg") => {
    const success = await swapMeal(mealType, preference);
    if (!success) {
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
