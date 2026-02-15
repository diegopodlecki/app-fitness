import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = {
    azul: {
        name: 'Azul Eléctrico',
        color: '#2F80ED', // Vibrante
        tint: '#2F80ED',
    },
    naranja: {
        name: 'Naranja Sunset',
        color: '#F2994A', // Cálido
        tint: '#F2994A',
    },
    verde: {
        name: 'Verde Éxito',
        color: '#27AE60', // Fresco
        tint: '#27AE60',
    },
    morado: {
        name: 'Morado Real',
        color: '#9B51E0', // Moderno
        tint: '#9B51E0',
    },
    rojo: {
        name: 'Rojo Pasión',
        color: '#EB5757', // Intenso
        tint: '#EB5757',
    },
};

export type ThemeKey = keyof typeof THEMES;

interface ThemeContextType {
    theme: string; // The active hex color
    themeName: ThemeKey;
    setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeName, setThemeName] = useState<ThemeKey>('azul');

    // Load theme from AsyncStorage on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const stored = await AsyncStorage.getItem('@theme');
                if (stored && stored in THEMES) {
                    setThemeName(stored as ThemeKey);
                }
            } catch (e) {
                console.error('Failed to load theme', e);
            }
        };
        loadTheme();
    }, []);

    // Save theme to AsyncStorage when it changes
    const handleSetTheme = async (key: ThemeKey) => {
        try {
            await AsyncStorage.setItem('@theme', key);
            setThemeName(key);
        } catch (e) {
            console.error('Failed to save theme', e);
        }
    };

    const value = {
        theme: THEMES[themeName].color,
        themeName,
        setTheme: handleSetTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
