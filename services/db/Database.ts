import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Detect if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

let db: SQLite.WebSQLDatabase | null = null;

// Only initialize SQLite if NOT in Expo Go
if (!isExpoGo) {
    try {
        db = SQLite.openDatabase('fitness_app.db');
    } catch (error) {
        console.warn('SQLite not available, will use AsyncStorage fallback');
    }
}

export const initDatabase = () => {
    // Skip SQLite initialization in Expo Go
    if (isExpoGo || !db) {
        console.log('Running in Expo Go - using AsyncStorage instead of SQLite');
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        db!.transaction(tx => {
            // Users Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY NOT NULL,
                    age TEXT,
                    height TEXT,
                    initial_weight TEXT
                );`
            );

            // Workouts Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS workouts (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT,
                    date TEXT,
                    timestamp INTEGER,
                    duration TEXT,
                    volume TEXT
                );`
            );

            // Exercises Table (Linked to Workouts)
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS exercises (
                    id TEXT PRIMARY KEY NOT NULL,
                    workout_id TEXT,
                    exercise_id TEXT,
                    name TEXT,
                    FOREIGN KEY (workout_id) REFERENCES workouts (id)
                );`
            );

            // Sets Table (Linked to Exercises)
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS sets (
                    id TEXT PRIMARY KEY NOT NULL,
                    exercise_id TEXT,
                    reps TEXT,
                    weight TEXT,
                    completed INTEGER,
                    FOREIGN KEY (exercise_id) REFERENCES exercises (id)
                );`
            );

            // Routines Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS routines (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT,
                    description TEXT,
                    created_at INTEGER
                );`
            );

            // Routine Exercises Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS routine_exercises (
                    id TEXT PRIMARY KEY NOT NULL,
                    routine_id TEXT,
                    exercise_id TEXT,
                    name TEXT,
                    target_sets TEXT,
                    target_reps TEXT,
                    target_weight TEXT,
                    notes TEXT,
                    FOREIGN KEY (routine_id) REFERENCES routines (id)
                );`
            );

            // Progress Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS progress (
                    id TEXT PRIMARY KEY NOT NULL,
                    date TEXT,
                    timestamp INTEGER,
                    weight TEXT,
                    measurements_json TEXT, -- Stores complex object as JSON string
                    photo_uri TEXT
                );`,
                [],
                () => resolve(),
                (_, error) => {
                    console.error("Error creating tables", error);
                    reject(error);
                    return false;
                }
            );
        });
    });
};

export const getDatabase = () => db;
export const isUsingAsyncStorage = () => isExpoGo || !db;
