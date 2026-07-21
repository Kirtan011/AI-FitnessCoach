import { create } from 'zustand'
import type { Exercise } from '@/lib/types'

interface WorkoutState {
  sessionData: any | null
  warmup: Exercise[]
  exercises: Exercise[]
  cooldown: Exercise[]
  
  currentSection: "warmup" | "main" | "cooldown"
  exerciseIndex: number
  completedSets: number[]
  skippedExercises: string[]
  isResting: boolean
  restTimeLeft: number
  workoutDuration: number
  showSummary: boolean

  initializeWorkout: (sessionData: any, warmup: Exercise[], exercises: Exercise[], cooldown: Exercise[]) => void
  completeSet: (setIdx: number, restTimeStr: string) => void
  tickRest: () => void
  tickDuration: () => void
  nextExercise: (skipped: boolean) => void
  resetWorkout: () => void
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  sessionData: null,
  warmup: [],
  exercises: [],
  cooldown: [],
  
  currentSection: "main",
  exerciseIndex: 0,
  completedSets: [],
  skippedExercises: [],
  isResting: false,
  restTimeLeft: 0,
  workoutDuration: 0,
  showSummary: false,

  initializeWorkout: (sessionData, warmup, exercises, cooldown) => {
    set({
      sessionData,
      warmup,
      exercises,
      cooldown,
      currentSection: warmup.length > 0 ? "warmup" : "main",
      exerciseIndex: 0,
      completedSets: [],
      skippedExercises: [],
      isResting: false,
      restTimeLeft: 0,
      workoutDuration: 0,
      showSummary: false,
    });
  },

  completeSet: (setIdx, restTimeStr) => {
    const { completedSets, currentSection, exerciseIndex, warmup, exercises, cooldown } = get();
    if (!completedSets.includes(setIdx)) {
      const updatedSets = [...completedSets, setIdx];
      
      const activeList = currentSection === "warmup" ? warmup : currentSection === "main" ? exercises : cooldown;
      const currentExercise = activeList[exerciseIndex];
      const totalSets = currentExercise?.sets || 1;
      
      let isResting = false;
      let restTimeLeft = 0;
      
      if (setIdx < totalSets - 1) {
        isResting = true;
        const match = restTimeStr.match(/(\d+)/);
        restTimeLeft = match ? parseInt(match[0], 10) : 60;
      }

      set({ completedSets: updatedSets, isResting, restTimeLeft });
    }
  },

  tickRest: () => {
    const { isResting, restTimeLeft } = get();
    if (isResting && restTimeLeft > 0) {
      set({ restTimeLeft: restTimeLeft - 1 });
    } else if (isResting && restTimeLeft <= 0) {
      set({ isResting: false });
    }
  },

  tickDuration: () => {
    set(state => ({ workoutDuration: state.workoutDuration + 1 }));
  },

  nextExercise: (skipped) => {
    const { 
      currentSection, exerciseIndex, skippedExercises, 
      warmup, exercises, cooldown 
    } = get();
    
    const activeList = currentSection === "warmup" ? warmup : currentSection === "main" ? exercises : cooldown;
    const currentExercise = activeList[exerciseIndex];
    
    const updatedSkipped = skipped && currentExercise ? [...skippedExercises, currentExercise.name] : skippedExercises;

    set({
      skippedExercises: updatedSkipped,
      isResting: false,
      completedSets: [],
    });

    if (exerciseIndex < activeList.length - 1) {
      set({ exerciseIndex: exerciseIndex + 1 });
    } else {
      // Next section
      if (currentSection === "warmup") {
        set({ currentSection: "main", exerciseIndex: 0 });
      } else if (currentSection === "main" && cooldown.length > 0) {
        set({ currentSection: "cooldown", exerciseIndex: 0 });
      } else {
        set({ showSummary: true });
      }
    }
  },

  resetWorkout: () => {
    set({
      sessionData: null,
      warmup: [],
      exercises: [],
      cooldown: [],
      currentSection: "main",
      exerciseIndex: 0,
      completedSets: [],
      skippedExercises: [],
      isResting: false,
      restTimeLeft: 0,
      workoutDuration: 0,
      showSummary: false,
    });
  }
}));
