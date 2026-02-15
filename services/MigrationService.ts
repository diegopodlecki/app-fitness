import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutRepository } from './repositories/WorkoutRepository';
import { ProgressRepository } from './repositories/ProgressRepository';
import { Workout, Routine } from '@/models/Workout';
import { ProgressEntry } from '@/models/Progress';
import { UserProfile } from '@/models/User';

export const MigrationService = {
    migrateFromAsyncStorage: async () => {
        try {
            const hasMigrated = await AsyncStorage.getItem('@db_migrated_v1');
            if (hasMigrated) return;

            console.log("Starting migration from AsyncStorage...");

            // 1. Migrate Workouts
            const storedWorkouts = await AsyncStorage.getItem('@workouts');
            if (storedWorkouts) {
                const workouts: Workout[] = JSON.parse(storedWorkouts);
                console.log(`Migrating ${workouts.length} workouts...`);
                for (const w of workouts) {
                    await WorkoutRepository.saveWorkout(w);
                }
            }

            // 2. Migrate Routines
            const storedRoutines = await AsyncStorage.getItem('@routines');
            if (storedRoutines) {
                const routines: Routine[] = JSON.parse(storedRoutines);
                console.log(`Migrating ${routines.length} routines...`);
                for (const r of routines) {
                    await WorkoutRepository.saveRoutine(r);
                }
            }

            // 3. Migrate Progress
            const storedProgress = await AsyncStorage.getItem('@progress');
            if (storedProgress) {
                const entries: ProgressEntry[] = JSON.parse(storedProgress);
                console.log(`Migrating ${entries.length} progress entries...`);
                for (const e of entries) {
                    await ProgressRepository.saveEntry(e);
                }
            }

            // 4. Migrate User Profile
            const storedProfile = await AsyncStorage.getItem('@profile');
            if (storedProfile) {
                const profile: UserProfile = JSON.parse(storedProfile);
                console.log(`Migrating user profile...`);
                await ProgressRepository.saveUserProfile(profile);
            }

            // Mark as migrated
            await AsyncStorage.setItem('@db_migrated_v1', 'true');
            console.log("Migration completed successfully.");

        } catch (e) {
            console.error("Migration failed:", e);
        }
    }
};
