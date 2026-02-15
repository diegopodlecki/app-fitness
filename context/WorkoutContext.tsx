
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, Routine } from '@/models/Workout';

// Removed local interfaces in favor of @/models/Workout

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

    // Initial Load from AsyncStorage
    useEffect(() => {
        const init = async () => {
            try {
                // Load workouts
                const storedWorkouts = await AsyncStorage.getItem('@workouts');
                if (storedWorkouts) {
                    setWorkouts(JSON.parse(storedWorkouts));
                }

                // Load routines
                const storedRoutines = await AsyncStorage.getItem('@routines');
                if (storedRoutines) {
                    setRoutines(JSON.parse(storedRoutines));
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);


    const addWorkout = async (workout: Workout) => {
        try {
            const updated = [workout, ...workouts];
            await AsyncStorage.setItem('@workouts', JSON.stringify(updated));
            setWorkouts(updated);
        } catch (e) {
            console.error("Failed to save workout", e);
        }
    };

    const addRoutine = async (routine: Routine) => {
        try {
            const updated = [routine, ...routines];
            await AsyncStorage.setItem('@routines', JSON.stringify(updated));
            setRoutines(updated);
        } catch (e) {
            console.error("Failed to save routine", e);
        }
    };

    const updateRoutine = async (id: string, updatedRoutine: Routine) => {
        try {
            const updated = routines.map(r => r.id === id ? updatedRoutine : r);
            await AsyncStorage.setItem('@routines', JSON.stringify(updated));
            setRoutines(updated);
        } catch (e) {
            console.error("Failed to update routine", e);
        }
    };

    const deleteRoutine = async (id: string) => {
        try {
            const updated = routines.filter(r => r.id !== id);
            await AsyncStorage.setItem('@routines', JSON.stringify(updated));
            setRoutines(updated);
        } catch (e) {
            console.error("Failed to delete routine", e);
        }
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
