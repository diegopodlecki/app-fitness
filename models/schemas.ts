import { z } from 'zod';

// --- Exercise Schema ---
export const ExerciseSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "El nombre del ejercicio es obligatorio"),
    sets: z.array(z.object({
        id: z.string(),
        reps: z.string().or(z.number()),
        weight: z.string().or(z.number()),
        completed: z.boolean().default(false),
    })),
});

// --- Workout Schema ---
export const WorkoutSchema = z.object({
    id: z.string(),
    date: z.string(),
    routineName: z.string(),
    duration: z.string(),
    exercises: z.array(ExerciseSchema),
    totalWeight: z.number().optional(),
});

// --- Routine Schema ---
export const RoutineSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "El nombre de la rutina es obligatorio"),
    exercises: z.array(z.object({
        id: z.string(),
        name: z.string(),
        targetSets: z.number().default(3),
    })),
    lastUsed: z.string().optional(),
});

// --- User Profile Schema ---
export const UserProfileSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    age: z.string().or(z.number()),
    height: z.string().or(z.number()),
    weight: z.string().or(z.number()),
    gender: z.enum(['Masculino', 'Femenino', 'Otro']),
    goal: z.string().optional(),
    avatar: z.string().optional(),
    measurements: z.object({
        neck: z.string().or(z.number()).optional(),
        shoulders: z.string().or(z.number()).optional(),
        chest: z.string().or(z.number()).optional(),
        waist: z.string().or(z.number()).optional(),
        hips: z.string().or(z.number()).optional(),
        bicepL: z.string().or(z.number()).optional(),
        bicepR: z.string().or(z.number()).optional(),
        forearmL: z.string().or(z.number()).optional(),
        forearmR: z.string().or(z.number()).optional(),
        thighL: z.string().or(z.number()).optional(),
        thighR: z.string().or(z.number()).optional(),
        calfL: z.string().or(z.number()).optional(),
        calfR: z.string().or(z.number()).optional(),
    }).optional(),
});

// --- Progress Entry Schema ---
export const ProgressEntrySchema = z.object({
    id: z.string(),
    date: z.string(),
    weight: z.number(),
    photos: z.array(z.string()).optional(),
    note: z.string().optional(),
});
