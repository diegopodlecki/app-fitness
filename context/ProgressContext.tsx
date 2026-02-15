import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/models/User';
import { ProgressEntry } from '@/models/Progress';
import ErrorService from '@/services/ErrorService';
import { progressService } from '@/services/progressService';

interface ProgressContextType {
    profile: UserProfile | null;
    updateProfile: (profile: UserProfile) => Promise<void>;
    entries: ProgressEntry[];
    addEntry: (entry: ProgressEntry) => Promise<void>;
    removeEntry: (id: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [entries, setEntries] = useState<ProgressEntry[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            try {
                const [p, e] = await Promise.all([
                    progressService.getProfile(),
                    progressService.getEntries()
                ]);
                setProfile(p);
                setEntries(e);
            } catch (e) {
                ErrorService.handle(e, 'No se pudo cargar el progreso.', true);
            }
        };
        loadData();
    }, []);

    const updateProfile = async (newProfile: UserProfile) => {
        try {
            const updated = await progressService.updateProfile(newProfile);
            setProfile(updated);
        } catch (e) {
            ErrorService.handle(e, 'Error al guardar el perfil.');
        }
    };

    const addEntry = async (entry: ProgressEntry) => {
        try {
            const saved = await progressService.addEntry(entry);
            setEntries(prev => [saved, ...prev]);
        } catch (e) {
            ErrorService.handle(e, 'Error al añadir la entrada de progreso.');
        }
    };

    const removeEntry = async (id: string) => {
        try {
            await progressService.removeEntry(id);
            setEntries(prev => prev.filter((e) => e.id !== id));
        } catch (e) {
            ErrorService.handle(e, 'Error al eliminar la entrada.');
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
