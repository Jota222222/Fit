export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  goal: string;
  frequency: number;
  conditions: string;
  targetWeight?: number;
  timeline?: string;
  location: string;
}

export interface Exercise {
  name: string;
  sets: number | string;
  reps: string;
  safetyNote: string;
  visualCue: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPhase {
  phaseName: string; // e.g., "Fase 1: Adaptação (Semanas 1-2)"
  description: string;
  schedule: DayPlan[];
}

export interface MealOption {
  optionName: string;
  description: string;
}

export interface MealTime {
  time: string; // e.g., "Café da Manhã"
  options: MealOption[];
}

export interface MenuDay {
  dayName: string; // e.g., "Segunda-feira" or "Opção A"
  meals: MealTime[];
}

export interface NutritionPlan {
  dailyCalories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  hydrationGoal: string;
  antiInflammatoryTips: string[];
  weeklyMenu: MenuDay[]; // Changed from dailyMenu to weeklyMenu (7 days)
}

export interface WorkoutPlanResponse {
  planName: string;
  planDurationAdvice: string; // Advice on when to change the plan (15 vs 30 days)
  description: string;
  phases: WorkoutPhase[]; // Changed from weeklySchedule to phases
  nutrition: NutritionPlan;
}