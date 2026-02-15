import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/models/User';
import { ProgressEntry } from '@/models/Progress';
import { UserProfileSchema, ProgressEntrySchema } from '@/models/schemas';

const PROFILE_KEY = '@user_profile';
const ENTRIES_KEY = '@progress_entries';

export const progressService = {
    /**
     * Profile Operations
     */
    async getProfile(): Promise<UserProfile | null> {
        const stored = await AsyncStorage.getItem(PROFILE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    async updateProfile(profile: UserProfile): Promise<UserProfile> {
        UserProfileSchema.parse(profile);
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        return profile;
    },

    /**
     * Progress Entries Operations
     */
    async getEntries(): Promise<ProgressEntry[]> {
        const stored = await AsyncStorage.getItem(ENTRIES_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    async addEntry(entry: ProgressEntry): Promise<ProgressEntry> {
        ProgressEntrySchema.parse(entry);

        const entries = await this.getEntries();
        const updated = [entry, ...entries];

        await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updated));
        return entry;
    },

    async removeEntry(id: string): Promise<void> {
        const entries = await this.getEntries();
        const updated = entries.filter(e => e.id !== id);
        await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updated));
    }
};
