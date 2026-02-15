import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    timestamp: number; // Unix timestamp for sorting/filtering
    name: string; // e.g., "Full Body" or "Afternoon Workout"
    duration: string; // e.g. "45 min"
    exercises: WorkoutExercise[];
    volume: string; // Total volume lifted
}

// Interfaces for Custom Routines
export interface RoutineExercise {
    exerciseId: string;
    name: string; // Specific name or override
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

interface WorkoutContextType {
    workouts: Workout[];
    addWorkout: (workout: Workout) => void;

    // Routines
    routines: Routine[];
    addRoutine: (routine: Routine) => void;
    updateRoutine: (id: string, updatedRoutine: Routine) => void;
    deleteRoutine: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedWorkouts = await AsyncStorage.getItem('@workouts');
                const storedRoutines = await AsyncStorage.getItem('@routines');

                if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
                if (storedRoutines) setRoutines(JSON.parse(storedRoutines));
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Helper to save workouts
    const saveWorkouts = async (newWorkouts: Workout[]) => {
        try {
            await AsyncStorage.setItem('@workouts', JSON.stringify(newWorkouts));
        } catch (e) {
            console.error("Failed to save workouts", e);
        }
    };

    // Helper to save routines
    const saveRoutines = async (newRoutines: Routine[]) => {
        try {
            await AsyncStorage.setItem('@routines', JSON.stringify(newRoutines));
        } catch (e) {
            console.error("Failed to save routines", e);
        }
    };

    const addWorkout = (workout: Workout) => {
        setWorkouts((prev) => {
            const updated = [workout, ...prev];
            saveWorkouts(updated);
            return updated;
        });
    };

    // Routine Actions
    const addRoutine = (routine: Routine) => {
        setRoutines((prev) => {
            const updated = [...prev, routine];
            saveRoutines(updated);
            return updated;
        });
    };

    const updateRoutine = (id: string, updatedRoutine: Routine) => {
        setRoutines((prev) => {
            const updated = prev.map(r => r.id === id ? updatedRoutine : r);
            saveRoutines(updated);
            return updated;
        });
    };

    const deleteRoutine = (id: string) => {
        setRoutines((prev) => {
            const updated = prev.filter(r => r.id !== id);
            saveRoutines(updated);
            return updated;
        });
    };

    return (
        <WorkoutContext.Provider value={{
            workouts,
            addWorkout,
            routines,
            addRoutine,
            updateRoutine,
            deleteRoutine
        }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkouts() {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useWorkouts must be used within a WorkoutProvider');
    }
    return context;
}
