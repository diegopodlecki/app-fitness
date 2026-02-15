import { getDatabase } from '../db/Database';
import { ProgressEntry } from '@/models/Progress';
import { UserProfile } from '@/models/User';

const db = getDatabase();

export const ProgressRepository = {
    // --- PROGRESS ---
    getAllEntries: (): Promise<ProgressEntry[]> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM progress ORDER BY timestamp DESC`,
                    [],
                    (_, { rows: { _array } }) => {
                        resolve(_array.map(row => ({
                            id: row.id,
                            date: row.date,
                            timestamp: row.timestamp,
                            weight: row.weight,
                            photoUri: row.photo_uri,
                            ...JSON.parse(row.measurements_json || '{}')
                        })));
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    },

    saveEntry: (entry: ProgressEntry): Promise<void> => {
        return new Promise((resolve, reject) => {
            const { id, date, timestamp, weight, photoUri, ...measurements } = entry;
            const jsonMeasurements = JSON.stringify(measurements);

            db.transaction(tx => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO progress (id, date, timestamp, weight, measurements_json, photo_uri) VALUES (?, ?, ?, ?, ?, ?)`,
                    [id, date, timestamp, weight, jsonMeasurements, photoUri || '']
                );
            }, (error) => reject(error), () => resolve());
        });
    },

    deleteEntry: (id: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`DELETE FROM progress WHERE id = ?`, [id]);
            }, (error) => reject(error), () => resolve());
        });
    },

    // --- USER PROFILE ---
    getUserProfile: (): Promise<UserProfile | null> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM users LIMIT 1`,
                    [],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            const u = _array[0];
                            resolve({
                                age: u.age,
                                height: u.height,
                                initialWeight: u.initial_weight
                            });
                        } else {
                            resolve(null);
                        }
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    },

    saveUserProfile: (profile: UserProfile): Promise<void> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                // Ensure only one user exists for now
                tx.executeSql(`DELETE FROM users`);
                tx.executeSql(
                    `INSERT INTO users (id, age, height, initial_weight) VALUES (?, ?, ?, ?)`,
                    ['user_default', profile.age, profile.height, profile.initialWeight]
                );
            }, (error) => reject(error), () => resolve());
        });
    }
};
