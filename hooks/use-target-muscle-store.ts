import { create } from 'zustand'
import type { FitnessPlan } from '@/lib/types'

interface TargetMuscleState {
  miniPlan: FitnessPlan | null
  targetMuscles: string[]
  
  setMiniPlan: (plan: FitnessPlan | null) => void
  setTargetMuscles: (muscles: string[]) => void
  loadTargetMuscleState: () => void
}

export const useTargetMuscleStore = create<TargetMuscleState>((set) => ({
  miniPlan: null,
  targetMuscles: [],

  setMiniPlan: (plan) => {
    set({ miniPlan: plan });
    if (plan) {
      localStorage.setItem("miniPlan", JSON.stringify(plan));
    } else {
      localStorage.removeItem("miniPlan");
    }
  },

  setTargetMuscles: (muscles) => {
    set({ targetMuscles: muscles });
    if (muscles.length > 0) {
      localStorage.setItem("targetMuscles", JSON.stringify(muscles));
    } else {
      localStorage.removeItem("targetMuscles");
    }
  },

  loadTargetMuscleState: () => {
    const savedMiniPlan = localStorage.getItem("miniPlan");
    const savedTargetMuscles = localStorage.getItem("targetMuscles");
    if (savedMiniPlan) set({ miniPlan: JSON.parse(savedMiniPlan) });
    if (savedTargetMuscles) set({ targetMuscles: JSON.parse(savedTargetMuscles) });
  },
}));
