import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, SectionList, TouchableOpacity, FlatList, Modal, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { exercisesData, workoutTemplates } from '@/constants/data';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useWorkouts, WorkoutExercise, WorkoutSet } from '@/context/WorkoutContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export default function TrainScreen() {
    const router = useRouter();
    const { addWorkout, routines } = useWorkouts();
    const { theme } = useTheme();

    const [workoutName, setWorkoutName] = useState('Entrenamiento Libre');
    const [activeExercises, setActiveExercises] = useState<WorkoutExercise[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isWorkoutActive, setIsWorkoutActive] = useState(false);

    // Modal State
    const [searchQuery, setSearchQuery] = useState('');
    const [availableExercises, setAvailableExercises] = useState(exercisesData);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isWorkoutActive) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isWorkoutActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const calculateVolume = () => {
        let totalVolume = 0;
        activeExercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (set.completed && set.weight && set.reps) {
                    totalVolume += (parseFloat(set.weight) * parseFloat(set.reps));
                }
            });
        });
        return `${totalVolume} kg`;
    };

    const handleStartWorkout = (name?: string) => {
        setIsWorkoutActive(true);
        setTimer(0);
        if (name) setWorkoutName(name);
    };

    const handleLoadTemplate = (template: any) => {
        const templateExercises: WorkoutExercise[] = template.exercises.map((exId: string) => {
            const exerciseDef = availableExercises.find(e => e.id === exId);
            if (!exerciseDef) return null;

            return {
                id: Math.random().toString(),
                exerciseId: exerciseDef.id,
                name: exerciseDef.name,
                sets: [
                    { id: Math.random().toString(), reps: '', weight: '', completed: false },
                    { id: Math.random().toString(), reps: '', weight: '', completed: false }
                ]
            };
        }).filter(Boolean);

        setActiveExercises(templateExercises);
        handleStartWorkout(template.name);
    };

    const handleLoadRoutine = (routine: any) => {
        const routineExercises: WorkoutExercise[] = routine.exercises.map((rEx: any) => {
            // Create sets based on targetSets
            const sets = [];
            const targetSetsCount = parseInt(rEx.targetSets) || 3;
            for (let i = 0; i < targetSetsCount; i++) {
                sets.push({
                    id: Math.random().toString(),
                    reps: rEx.targetReps || '',
                    weight: rEx.targetWeight || '', // Pre-fill target weight if exists
                    completed: false
                });
            }

            return {
                id: Math.random().toString(),
                exerciseId: rEx.exerciseId,
                name: rEx.name,
                sets: sets
            };
        });

        setActiveExercises(routineExercises);
        handleStartWorkout(routine.name);
    };

    const handleFinishWorkout = () => {
        if (activeExercises.length === 0) return;

        Alert.alert(
            "Terminar Entrenamiento",
            "¿Deseas guardar este entrenamiento?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Guardar y Terminar",
                    onPress: () => {
                        const newWorkout = {
                            id: Math.random().toString(),
                            date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                            timestamp: Date.now(),
                            name: workoutName,
                            duration: formatTime(timer),
                            exercises: activeExercises,
                            volume: calculateVolume()
                        };

                        addWorkout(newWorkout);

                        // Reset
                        setIsWorkoutActive(false);
                        setActiveExercises([]);
                        setTimer(0);
                        setWorkoutName('Entrenamiento Libre');

                        // Navigate to History
                        router.push('/(tabs)/history');
                    }
                }
            ]
        );
    };

    const addExercise = (exercise: any) => {
        const newExercise: WorkoutExercise = {
            id: Math.random().toString(),
            exerciseId: exercise.id,
            name: exercise.name,
            sets: [
                { id: Math.random().toString(), reps: '', weight: '', completed: false }
            ]
        };
        setActiveExercises([...activeExercises, newExercise]);
        setModalVisible(false);
        if (!isWorkoutActive) handleStartWorkout();
    };

    const addSet = (exerciseIndex: number) => {
        const newExercises = [...activeExercises];
        newExercises[exerciseIndex].sets.push({
            id: Math.random().toString(),
            reps: '',
            weight: '',
            completed: false
        });
        setActiveExercises(newExercises);
    };

    const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: string) => {
        const newExercises = [...activeExercises];
        newExercises[exerciseIndex].sets[setIndex] = {
            ...newExercises[exerciseIndex].sets[setIndex],
            [field]: value
        };
        setActiveExercises(newExercises);
    };

    const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
        const newExercises = [...activeExercises];
        newExercises[exerciseIndex].sets[setIndex].completed = !newExercises[exerciseIndex].sets[setIndex].completed;
        setActiveExercises(newExercises);
    };

    const filteredExercises = availableExercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateExercise = () => {
        const newCustomExercise = {
            id: Math.random().toString(),
            name: searchQuery,
            muscle: 'Personalizado',
            equipment: 'N/A',
            secondaryMuscles: [],
            level: 'N/A',
            benefits: 'Ejercicio personalizado creado por el usuario.',
            description: 'Sin descripción detallada.'
        };
        setAvailableExercises([...availableExercises, newCustomExercise]);
        addExercise(newCustomExercise);
        setSearchQuery('');
    };

    const ExerciseModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Añadir Ejercicio</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <FontAwesome name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <FontAwesome name="search" size={16} color="#8E8E93" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar o crear..."
                            placeholderTextColor="#8E8E93"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={false}
                        />
                    </View>

                    <FlatList
                        data={filteredExercises}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    addExercise(item);
                                    setSearchQuery('');
                                }}
                            >
                                <Text style={styles.modalItemText}>{item.name}</Text>
                                <Text style={styles.modalItemSub}>{item.muscle}</Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#333' }} />}
                        ListEmptyComponent={() => (
                            <View style={styles.emptySearchContainer}>
                                <Text style={styles.emptySearchText}>No encontrado</Text>
                                <TouchableOpacity style={[styles.createButton, { backgroundColor: theme }]} onPress={handleCreateExercise}>
                                    <Text style={styles.createButtonText}>Crear "{searchQuery}"</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </View>
        </Modal>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <TextInput
                    style={styles.headerTitleInput}
                    value={workoutName}
                    onChangeText={setWorkoutName}
                    placeholder="Nombre del entrenamiento"
                    placeholderTextColor="#666"
                />
                <Text style={[styles.headerSubtitle, isWorkoutActive && { color: theme }]}>
                    {formatTime(timer)}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {activeExercises.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>Empieza a Entrenar</Text>
                        <Text style={styles.emptyStateSub}>Selecciona una rutina o empieza desde cero</Text>

                        <TouchableOpacity style={[styles.startEmptyButton, { backgroundColor: theme }]} onPress={() => handleStartWorkout('Entrenamiento Libre')}>
                            <Text style={styles.startEmptyButtonText}>Iniciar Entrenamiento Vacío</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>MIS RUTINAS</Text>
                            <View style={styles.line} />
                        </View>

                        {routines.length > 0 ? (
                            <View style={styles.templatesContainer}>
                                {routines.map(routine => (
                                    <TouchableOpacity
                                        key={routine.id}
                                        style={styles.templateCard}
                                        onPress={() => handleLoadRoutine(routine)}
                                    >
                                        <View style={[styles.templateIcon, { backgroundColor: theme + '20' }]}>
                                            <FontAwesome name="star" size={24} color={theme} />
                                        </View>
                                        <View style={styles.templateContent}>
                                            <Text style={styles.templateName}>{routine.name}</Text>
                                            <Text style={styles.templateCount}>{routine.exercises.length} Ejercicios</Text>
                                        </View>
                                        <FontAwesome name="play" size={14} color={theme} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={{ marginBottom: 20, padding: 10 }}
                                onPress={() => router.push('/routines' as any)}
                            >
                                <Text style={{ color: '#8E8E93', textDecorationLine: 'underline' }}>Crear mi primera rutina</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.manageButton, { borderColor: theme }]}
                            onPress={() => router.push('/routines' as any)}
                        >
                            <Text style={[styles.manageButtonText, { color: theme }]}>Gestionar Rutinas</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>TEMPLATES</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.templatesContainer}>
                            {workoutTemplates.map(template => (
                                <TouchableOpacity
                                    key={template.id}
                                    style={styles.templateCard}
                                    onPress={() => handleLoadTemplate(template)}
                                >
                                    <View style={[styles.templateIcon, { backgroundColor: theme + '20' }]}>
                                        <FontAwesome name="list-alt" size={24} color={theme} />
                                    </View>
                                    <View style={styles.templateContent}>
                                        <Text style={styles.templateName}>{template.name}</Text>
                                        <Text style={styles.templateCount}>{template.exercises.length} Ejercicios</Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color="#666" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    <>
                        {activeExercises.map((exercise, exIndex) => (
                            <View key={exercise.id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    <TouchableOpacity>
                                        <FontAwesome name="ellipsis-h" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.setRow}>
                                    <Text style={styles.setHeader}>SET</Text>
                                    <Text style={styles.setHeader}>KG</Text>
                                    <Text style={styles.setHeader}>REPS</Text>
                                    <View style={{ width: 32 }} />
                                </View>

                                {exercise.sets.map((set, setIndex) => (
                                    <View key={set.id} style={[styles.setInputRow, set.completed && styles.completedSetRow]}>
                                        <View style={styles.setNumberBadge}>
                                            <Text style={styles.setNumberText}>{setIndex + 1}</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.input, set.completed && styles.disabledInput]}
                                            placeholder="-"
                                            placeholderTextColor="#666"
                                            keyboardType="numeric"
                                            value={set.weight}
                                            onChangeText={(val) => updateSet(exIndex, setIndex, 'weight', val)}
                                            editable={!set.completed}
                                        />
                                        <TextInput
                                            style={[styles.input, set.completed && styles.disabledInput]}
                                            placeholder="-"
                                            placeholderTextColor="#666"
                                            keyboardType="numeric"
                                            value={set.reps}
                                            onChangeText={(val) => updateSet(exIndex, setIndex, 'reps', val)}
                                            editable={!set.completed}
                                        />
                                        <TouchableOpacity
                                            style={[styles.checkButton, set.completed && { backgroundColor: '#34C759' }]}
                                            onPress={() => toggleSetComplete(exIndex, setIndex)}
                                        >
                                            <FontAwesome name="check" size={14} color={set.completed ? "#fff" : "#666"} />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <TouchableOpacity
                                    style={styles.addSetButton}
                                    onPress={() => addSet(exIndex)}
                                >
                                    <Text style={[styles.addSetText, { color: theme }]}>+ Añadir Serie</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={styles.addExerciseButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={[styles.addExerciseText, { color: theme }]}>+ Añadir Ejercicio</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {activeExercises.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.finishButton, { backgroundColor: theme }]}
                        onPress={handleFinishWorkout}
                    >
                        <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ExerciseModal />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark Grey Background
    },
    header: {
        padding: 20,
        backgroundColor: '#121212',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        alignItems: 'center',
    },
    headerTitleInput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // White Text
        textAlign: 'center',
        width: '100%',
    },
    headerSubtitle: {
        fontSize: 24,
        color: '#8E8E93',
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
        marginTop: 4,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    emptyStateText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff', // White Text
    },
    emptyStateSub: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 8,
        textAlign: 'center',
        marginBottom: 20,
    },
    startEmptyButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    startEmptyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        width: '100%',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#8E8E93',
        fontSize: 12,
        fontWeight: '600',
    },
    manageButton: {
        marginBottom: 20,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        width: '100%',
    },
    manageButtonText: {
        fontWeight: '600',
        fontSize: 14,
    },
    templatesContainer: {
        width: '100%',
    },
    templateCard: {
        backgroundColor: '#1C1C1E', // Dark Grey Card
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    templateIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    templateContent: {
        flex: 1,
    },
    templateName: {
        color: '#fff',
        fontSize: 18, // +2
        fontWeight: '600',
        marginBottom: 2,
    },
    templateCount: {
        color: '#aaa',
        fontSize: 14, // +2
    },
    card: {
        backgroundColor: '#1C1C1E', // Dark Grey Card
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 20, // +2
        fontWeight: '600',
    },
    setRow: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 0,
    },
    setHeader: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '600',
    },
    setInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    completedSetRow: {
        opacity: 0.6,
    },
    setNumberBadge: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    setNumberText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14, // +2
    },
    input: {
        backgroundColor: '#333',
        borderRadius: 8,
        width: 60,
        padding: 10,
        color: '#fff',
        textAlign: 'center',
        fontSize: 18, // +2
        fontWeight: '600',
    },
    disabledInput: {
        backgroundColor: '#1C1C1E',
        color: '#666',
        borderWidth: 1,
        borderColor: '#333',
    },
    checkButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#2C2C2E',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    activeCheckButton: {
        // backgroundColor: '#34C759', // Handled inline
    },
    addSetButton: {
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 0,
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
    },
    addSetText: {
        fontWeight: '600',
        fontSize: 14,
    },
    addExerciseButton: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    addExerciseText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#121212',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    finishButton: {
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    finishButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay
    },
    modalContent: {
        backgroundColor: '#1C1C1E', // Dark Modal
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalItem: {
        paddingVertical: 16,
    },
    modalItemText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
    modalItemSub: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        height: '100%',
    },
    emptySearchContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    emptySearchText: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 10,
    },
    createButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
