import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/models/User';
import { ProgressEntry } from '@/models/Progress';
import ErrorService from '@/services/ErrorService';
import { UserProfileSchema, ProgressEntrySchema } from '@/models/schemas';

interface ProgressContextType {
    profile: UserProfile | null;
    updateProfile: (profile: UserProfile) => void;
    entries: ProgressEntry[];
    addEntry: (entry: ProgressEntry) => void;
    removeEntry: (id: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [entries, setEntries] = useState<ProgressEntry[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedEntries = await AsyncStorage.getItem('@progress_entries');
                const storedProfile = await AsyncStorage.getItem('@user_profile');

                if (storedEntries) setEntries(JSON.parse(storedEntries));
                if (storedProfile) setProfile(JSON.parse(storedProfile));
            } catch (e) {
                ErrorService.handle(e, 'No se pudo cargar el progreso.', true);
            }
        };
        loadData();
    }, []);

    const updateProfile = async (newProfile: UserProfile) => {
        try {
            // Validate data
            UserProfileSchema.parse(newProfile);

            await AsyncStorage.setItem('@user_profile', JSON.stringify(newProfile));
            setProfile(newProfile);
        } catch (e) {
            ErrorService.handle(e, 'Datos de perfil inválidos o error al guardar.');
        }
    };

    const addEntry = async (entry: ProgressEntry) => {
        try {
            // Validate data
            ProgressEntrySchema.parse(entry);

            const updated = [entry, ...entries];
            await AsyncStorage.setItem('@progress_entries', JSON.stringify(updated));
            setEntries(updated);
        } catch (e) {
            ErrorService.handle(e, 'Datos de progreso inválidos o error al añadir.');
        }
    };

    const removeEntry = async (id: string) => {
        try {
            const updated = entries.filter((e) => e.id !== id);
            await AsyncStorage.setItem('@progress_entries', JSON.stringify(updated));
            setEntries(updated);
        } catch (e) {
            ErrorService.handle(e, 'No se pudo eliminar la entrada.');
        }
    };

    return (
        <ProgressContext.Provider value={{ profile, updateProfile, entries, addEntry, removeEntry }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
}
