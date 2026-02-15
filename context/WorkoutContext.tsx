import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout, Routine } from '@/models/Workout';
import ErrorService from '@/services/ErrorService';
import { workoutService } from '@/services/workoutService';
import { routineService } from '@/services/routineService';

interface WorkoutContextType {
    workouts: Workout[];
    addWorkout: (workout: Workout) => Promise<void>;

    // Routines
    routines: Routine[];
    addRoutine: (routine: Routine) => Promise<void>;
    updateRoutine: (id: string, updatedRoutine: Routine) => Promise<void>;
    deleteRoutine: (id: string) => Promise<void>;
    loading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const init = async () => {
            try {
                const [w, r] = await Promise.all([
                    workoutService.getAll(),
                    routineService.getAll()
                ]);
                setWorkouts(w);
                setRoutines(r);
            } catch (e) {
                ErrorService.handle(e, 'Fallo al cargar los datos del entrenamiento.', true);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const addWorkout = async (workout: Workout) => {
        try {
            const saved = await workoutService.save(workout);
            setWorkouts(prev => [saved, ...prev]);
        } catch (e) {
            ErrorService.handle(e, 'Error al guardar el entrenamiento.');
        }
    };

    const addRoutine = async (routine: Routine) => {
        try {
            const saved = await routineService.save(routine);
            setRoutines(prev => [saved, ...prev]);
        } catch (e) {
            ErrorService.handle(e, 'Error al guardar la rutina.');
        }
    };

    const updateRoutine = async (id: string, updatedRoutine: Routine) => {
        try {
            const updated = await routineService.update(id, updatedRoutine);
            setRoutines(prev => prev.map(r => r.id === id ? updated : r));
        } catch (e) {
            ErrorService.handle(e, 'Error al actualizar la rutina.');
        }
    };

    const deleteRoutine = async (id: string) => {
        try {
            await routineService.delete(id);
            setRoutines(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            ErrorService.handle(e, 'Error al eliminar la rutina.');
        }
    };

    return (
        <WorkoutContext.Provider value={{
            workouts,
            addWorkout,
            routines,
            addRoutine,
            updateRoutine,
            deleteRoutine,
            loading
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
