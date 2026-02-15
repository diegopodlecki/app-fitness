export interface WorkoutSet {
    id: string;
    reps: string;
    weight: string;
    completed: boolean;
}

export interface WorkoutExercise {
    id: string; // unique instance id
    exerciseId: string;
    name: string;
    sets: WorkoutSet[];
}

export interface Workout {
    id: string;
    date: string; // ISO string or formatted date
    timestamp: number; // Unix timestamp
    name: string;
    duration: string;
    exercises: WorkoutExercise[];
    volume: string;
}

export interface RoutineExercise {
    exerciseId: string;
    name: string;
    targetSets: string;
    targetReps: string;
    targetWeight?: string;
    notes?: string;
}

export interface Routine {
    id: string;
    name: string;
    description?: string;
    exercises: RoutineExercise[];
    createdAt: number;
}
