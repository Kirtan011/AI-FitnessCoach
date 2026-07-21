import { create } from 'zustand'
import type { UserProfile, FitnessPlan } from '@/lib/types'

interface PlanState {
  userProfile: UserProfile | null
  fitnessPlan: FitnessPlan | null
  planId: string | null
  isLoading: boolean
  isInitialLoading: boolean
  
  fetchFitnessPlan: (planId?: string | null) => Promise<boolean>
  regeneratePlan: (updatedProfile?: UserProfile) => Promise<boolean>
  resetPlan: () => Promise<boolean>
  swapMeal: (mealType: string, preference: 'veg' | 'non-veg') => Promise<boolean>
  setUserProfile: (profile: UserProfile) => void
}

export const usePlanStore = create<PlanState>((set, get) => ({
  userProfile: null,
  fitnessPlan: null,
  planId: null,
  isLoading: false,
  isInitialLoading: true,

  fetchFitnessPlan: async (planId) => {
    set({ isInitialLoading: true });
    try {
      const url = planId ? `/api/fitness-plan?id=${planId}` : "/api/fitness-plan";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.profile && data.plan && data.id) {
          set({
            userProfile: data.profile,
            fitnessPlan: data.plan,
            planId: data.id,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Failed to load saved plan:", error);
      return false;
    } finally {
      set({ isInitialLoading: false });
    }
  },

  regeneratePlan: async (updatedProfile) => {
    const profileToUse = updatedProfile || get().userProfile;
    if (!profileToUse) return false;
    
    set({ isLoading: true });
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profileToUse, isRegenerate: true }),
      });

      if (!response.ok) throw new Error("Failed to regenerate");

      const planData = await response.json();
      set({
        fitnessPlan: planData,
        planId: planData.id,
      });
      if (updatedProfile) {
        set({ userProfile: updatedProfile });
      }
      return true;
    } catch (error) {
      console.error("Error generating plan:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPlan: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/fitness-plan", { method: "DELETE" });
      if (response.ok) {
        set({ userProfile: null, fitnessPlan: null, planId: null });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error resetting plan:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  swapMeal: async (mealType, preference) => {
    const { planId, fitnessPlan } = get();
    if (!fitnessPlan || !fitnessPlan.dietPlan) return false;
    
    const currentMeal = (fitnessPlan.dietPlan as any)[mealType];
    if (!currentMeal) return false;

    try {
      const response = await fetch("/api/swap-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, mealType, currentMeal, preference }),
      });

      if (!response.ok) throw new Error("Failed to swap meal");

      const data = await response.json();
      if (data.updatedPlan) {
        set({ fitnessPlan: data.updatedPlan });
      } else if (data.meal) {
        const updated = { ...fitnessPlan };
        if (updated.dietPlan) {
          (updated.dietPlan as any)[mealType] = data.meal;
        }
        set({ fitnessPlan: updated });
      }
      return true;
    } catch (error) {
      console.error("Error swapping meal:", error);
      return false;
    }
  },

  setUserProfile: (profile) => set({ userProfile: profile }),
}));
