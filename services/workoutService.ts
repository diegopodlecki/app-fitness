import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '@/models/Workout';
import { WorkoutSchema } from '@/models/schemas';

const WORKOUTS_KEY = '@workouts';

export const workoutService = {
    /**
     * Get all workouts from storage
     */
    async getAll(): Promise<Workout[]> {
        const stored = await AsyncStorage.getItem(WORKOUTS_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    /**
     * Save a new workout after validation
     */
    async save(workout: Workout): Promise<Workout> {
        // Validation logic
        WorkoutSchema.parse(workout);

        const workouts = await this.getAll();
        const updated = [workout, ...workouts];

        await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
        return workout;
    },

    /**
     * Delete a workout
     */
    async delete(id: string): Promise<void> {
        const workouts = await this.getAll();
        const updated = workouts.filter(w => w.id !== id);
        await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
    }
};
