import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, Routine } from '@/models/Workout';
import ErrorService from '@/services/ErrorService';
import { WorkoutSchema, RoutineSchema } from '@/models/schemas';

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
                ErrorService.handle(e, 'Fallo al cargar los datos almacenados.', true);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const addWorkout = async (workout: Workout) => {
        try {
            // Validate data
            WorkoutSchema.parse(workout);

            const updated = [workout, ...workouts];
            await AsyncStorage.setItem('@workouts', JSON.stringify(updated));
            setWorkouts(updated);
        } catch (e) {
            ErrorService.handle(e, 'Datos de entrenamiento inválidos o error al guardar.');
        }
    };

    const addRoutine = async (routine: Routine) => {
        try {
            // Validate data
            RoutineSchema.parse(routine);

            const updated = [routine, ...routines];
            await AsyncStorage.setItem('@routines', JSON.stringify(updated));
            setRoutines(updated);
        } catch (e) {
            ErrorService.handle(e, 'Datos de rutina inválidos o error al guardar.');
        }
    };

    const updateRoutine = async (id: string, updatedRoutine: Routine) => {
        try {
            // Validate data
            RoutineSchema.parse(updatedRoutine);

            const updated = routines.map(r => r.id === id ? updatedRoutine : r);
            await AsyncStorage.setItem('@routines', JSON.stringify(updated));
            setRoutines(updated);
        } catch (e) {
            ErrorService.handle(e, 'Datos de rutina inválidos o error al actualizar.');
        }
    };

    const deleteRoutine = async (id: string) => {
        try {
            const updated = routines.filter(r => r.id !== id);
            await AsyncStorage.setItem('@routines', JSON.stringify(updated));
            setRoutines(updated);
        } catch (e) {
            ErrorService.handle(e, 'No se pudo eliminar la rutina.');
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
