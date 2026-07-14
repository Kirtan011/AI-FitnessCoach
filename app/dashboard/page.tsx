"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlanDisplay } from "@/components/plan-display";
import { LoadingScreen } from "@/components/loading-screen";
import { DashboardOverview } from "@/components/dashboard-overview";
import type { UserProfile, FitnessPlan } from "@/lib/types";

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadSavedPlan() {
      try {
        const response = await fetch("/api/fitness-plan");
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
  }, [router]);

  const handleRegenerate = async () => {
    if (userProfile) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: userProfile, isRegenerate: true }),
        });

        if (!response.ok) throw new Error("Failed to regenerate");

        const planData: { id: string, plan: FitnessPlan } = await response.json();
        setFitnessPlan(planData.plan);
        setPlanId(planData.id);
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
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500 space-y-8 pb-12">
      <DashboardOverview stats={stats} />
      
      <PlanDisplay
        planId={planId}
        plan={fitnessPlan}
        userProfile={userProfile}
        onRegenerate={handleRegenerate}
        onReset={handleReset}
        isLoading={isLoading}
      />
    </div>
  );
}
