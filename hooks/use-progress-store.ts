import { create } from 'zustand'

interface ProgressState {
  stats: any
  workoutHistory: any[]
  
  fetchStats: () => Promise<void>
  fetchWorkoutHistory: () => Promise<void>
}

export const useProgressStore = create<ProgressState>((set) => ({
  stats: null,
  workoutHistory: [],

  fetchStats: async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        set({ stats: await res.json() });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  },

  fetchWorkoutHistory: async () => {
    try {
      const response = await fetch("/api/workout-history");
      if (response.ok) {
        set({ workoutHistory: await response.json() });
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  },
}));
