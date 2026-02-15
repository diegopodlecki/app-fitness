import { getDatabase } from '../db/Database';
import { Workout, WorkoutExercise, WorkoutSet, Routine, RoutineExercise } from '@/models/Workout';

const db = getDatabase();

export const WorkoutRepository = {
    // --- WORKOUTS ---
    getAllWorkouts: (): Promise<Workout[]> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM workouts ORDER BY timestamp DESC`,
                    [],
                    async (_, { rows: { _array } }) => {
                        const workouts: Workout[] = [];
                        for (const w of _array) {
                            const exercises = await WorkoutRepository.getExercisesForWorkout(w.id);
                            workouts.push({
                                ...w,
                                exercises
                            });
                        }
                        resolve(workouts);
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    },

    getExercisesForWorkout: (workoutId: string): Promise<WorkoutExercise[]> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM exercises WHERE workout_id = ?`,
                    [workoutId],
                    async (_, { rows: { _array } }) => {
                        const exercises: WorkoutExercise[] = [];
                        for (const ex of _array) {
                            const sets = await WorkoutRepository.getSetsForExercise(ex.id);
                            exercises.push({
                                id: ex.id,
                                exerciseId: ex.exercise_id,
                                name: ex.name,
                                sets
                            });
                        }
                        resolve(exercises);
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    },

    getSetsForExercise: (exerciseId: string): Promise<WorkoutSet[]> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM sets WHERE exercise_id = ?`,
                    [exerciseId],
                    (_, { rows: { _array } }) => {
                        resolve(_array.map(s => ({
                            id: s.id,
                            reps: s.reps,
                            weight: s.weight,
                            completed: s.completed === 1
                        })));
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    },

    saveWorkout: (workout: Workout): Promise<void> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                // Insert Workout
                tx.executeSql(
                    `INSERT OR REPLACE INTO workouts (id, name, date, timestamp, duration, volume) VALUES (?, ?, ?, ?, ?, ?)`,
                    [workout.id, workout.name, workout.date, workout.timestamp, workout.duration, workout.volume]
                );

                // Insert Exercises & Sets
                workout.exercises.forEach(ex => {
                    tx.executeSql(
                        `INSERT OR REPLACE INTO exercises (id, workout_id, exercise_id, name) VALUES (?, ?, ?, ?)`,
                        [ex.id, workout.id, ex.exerciseId, ex.name]
                    );

                    ex.sets.forEach(set => {
                        tx.executeSql(
                            `INSERT OR REPLACE INTO sets (id, exercise_id, reps, weight, completed) VALUES (?, ?, ?, ?, ?)`,
                            [set.id, ex.id, set.reps, set.weight, set.completed ? 1 : 0]
                        );
                    });
                });
            }, (error) => reject(error), () => resolve());
        });
    },

    // --- ROUTINES ---
    getAllRoutines: (): Promise<Routine[]> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM routines ORDER BY created_at DESC`,
                    [],
                    async (_, { rows: { _array } }) => {
                        const routines: Routine[] = [];
                        for (const r of _array) {
                            const exercises = await WorkoutRepository.getExercisesForRoutine(r.id);
                            routines.push({
                                id: r.id,
                                name: r.name,
                                description: r.description,
                                createdAt: r.created_at,
                                exercises
                            });
                        }
                        resolve(routines);
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    },

    getExercisesForRoutine: (routineId: string): Promise<RoutineExercise[]> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM routine_exercises WHERE routine_id = ?`,
                    [routineId],
                    (_, { rows: { _array } }) => {
                        resolve(_array.map(e => ({
                            exerciseId: e.exercise_id,
                            name: e.name,
                            targetSets: e.target_sets,
                            targetReps: e.target_reps,
                            targetWeight: e.target_weight,
                            notes: e.notes
                        })));
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    },

    saveRoutine: (routine: Routine): Promise<void> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO routines (id, name, description, created_at) VALUES (?, ?, ?, ?)`,
                    [routine.id, routine.name, routine.description || '', routine.createdAt]
                );

                // Clear old exercises for this routine to avoid duplicates/zombies on update
                tx.executeSql(`DELETE FROM routine_exercises WHERE routine_id = ?`, [routine.id]);

                routine.exercises.forEach(ex => {
                    tx.executeSql(
                        `INSERT INTO routine_exercises (id, routine_id, exercise_id, name, target_sets, target_reps, target_weight, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [Math.random().toString(), routine.id, ex.exerciseId, ex.name, ex.targetSets, ex.targetReps, ex.targetWeight || '', ex.notes || '']
                    );
                });
            }, (error) => reject(error), () => resolve());
        });
    },

    deleteRoutine: (id: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`DELETE FROM routines WHERE id = ?`, [id]);
                tx.executeSql(`DELETE FROM routine_exercises WHERE routine_id = ?`, [id]);
            }, (error) => reject(error), () => resolve());
        });
    }
};
