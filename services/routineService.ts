import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from '@/models/Workout';
import { RoutineSchema } from '@/models/schemas';

const ROUTINES_KEY = '@routines';

export const routineService = {
    /**
     * Get all routines from storage
     */
    async getAll(): Promise<Routine[]> {
        const stored = await AsyncStorage.getItem(ROUTINES_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    /**
     * Save/Create a new routine
     */
    async save(routine: Routine): Promise<Routine> {
        RoutineSchema.parse(routine);

        const routines = await this.getAll();
        const updated = [routine, ...routines];

        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(updated));
        return routine;
    },

    /**
     * Update an existing routine
     */
    async update(id: string, updatedRoutine: Routine): Promise<Routine> {
        RoutineSchema.parse(updatedRoutine);

        const routines = await this.getAll();
        const updated = routines.map(r => r.id === id ? updatedRoutine : r);

        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(updated));
        return updatedRoutine;
    },

    /**
     * Delete a routine
     */
    async delete(id: string): Promise<void> {
        const routines = await this.getAll();
        const updated = routines.filter(r => r.id !== id);
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(updated));
    }
};
