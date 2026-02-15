import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User Profile
export interface UserProfile {
    age: string;
    height: string; // cm
    initialWeight: string; // kg
}

export interface ProgressEntry {
    id: string;
    date: string;
    timestamp: number;
    weight: string; // kg

    // Detailed Measurements
    neck?: string;
    shoulders?: string;
    chest?: string;
    waist?: string;
    hips?: string;
    bicepLeft?: string;
    bicepRight?: string;
    forearmLeft?: string;
    forearmRight?: string;
    thighLeft?: string; // Muslo
    thighRight?: string;
    quadLeft?: string; // Cuadriceps (User specific request)
    quadRight?: string;
    calfLeft?: string;
    calfRight?: string;

    photoUri?: string;
}

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
                const storedEntries = await AsyncStorage.getItem('@progress');
                const storedProfile = await AsyncStorage.getItem('@profile');

                if (storedEntries) {
                    setEntries(JSON.parse(storedEntries));
                }
                if (storedProfile) {
                    setProfile(JSON.parse(storedProfile));
                }
            } catch (e) {
                console.error("Failed to load progress", e);
            }
        };
        loadData();
    }, []);

    const saveProfile = async (newProfile: UserProfile) => {
        try {
            await AsyncStorage.setItem('@profile', JSON.stringify(newProfile));
        } catch (e) {
            console.error("Failed to save profile", e);
        }
    };

    const saveEntries = async (newEntries: ProgressEntry[]) => {
        try {
            await AsyncStorage.setItem('@progress', JSON.stringify(newEntries));
        } catch (e) {
            console.error("Failed to save progress", e);
        }
    };

    const updateProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
        saveProfile(newProfile);
    };

    const addEntry = (entry: ProgressEntry) => {
        setEntries((prev) => {
            const updated = [...prev, entry];
            saveEntries(updated);
            return updated;
        });
    };

    const removeEntry = (id: string) => {
        setEntries((prev) => {
            const updated = prev.filter((e) => e.id !== id);
            saveEntries(updated);
            return updated;
        });
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
