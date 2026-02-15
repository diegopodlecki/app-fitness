import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, Modal, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useWorkouts, Routine, RoutineExercise } from '@/context/WorkoutContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { exercisesData } from '@/constants/data';

export default function RoutineEditorScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams<{ id: string }>();
    const { addRoutine, updateRoutine, routines } = useWorkouts();

    const isEditing = !!params.id;
    const existingRoutine = routines.find(r => r.id === params.id);

    const [name, setName] = useState(existingRoutine?.name || '');
    const [exercises, setExercises] = useState<RoutineExercise[]>(existingRoutine?.exercises || []);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [availableExercises, setAvailableExercises] = useState(exercisesData);

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert("Nombre Requerido", "Por favor asigna un nombre a la rutina.");
            return;
        }
        if (exercises.length === 0) {
            Alert.alert("Ejercicios Requeridos", "Añade al menos un ejercicio.");
            return;
        }

        const routineData: Routine = {
            id: isEditing ? (params.id as string) : Math.random().toString(),
            name,
            exercises,
            createdAt: existingRoutine?.createdAt || Date.now()
        };

        if (isEditing) {
            updateRoutine(routineData.id, routineData);
        } else {
            addRoutine(routineData);
        }

        router.back();
    };

    // Exercise Management
    const addExercise = (exerciseDef: any) => {
        const newExercise: RoutineExercise = {
            exerciseId: exerciseDef.id,
            name: exerciseDef.name,
            targetSets: '3',
            targetReps: '10',
            targetWeight: '',
            notes: ''
        };
        setExercises([...exercises, newExercise]);
        setModalVisible(false);
        setSearchQuery('');
    };

    const removeExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const updateExercise = (index: number, field: keyof RoutineExercise, value: string) => {
        const newExercises = [...exercises];
        newExercises[index] = { ...newExercises[index], [field]: value };
        setExercises(newExercises);
    };

    // Exercise Selector Logic
    const filteredExercises = availableExercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateCustomExercise = () => {
        const newCustomExercise = {
            id: Math.random().toString(),
            name: searchQuery,
            muscle: 'Personalizado',
            equipment: 'N/A',
            secondaryMuscles: [],
            level: 'N/A',
            benefits: 'Ejercicio personalizado.',
            description: 'Creado en editor de rutinas.'
        };
        setAvailableExercises([...availableExercises, newCustomExercise]);
        addExercise(newCustomExercise);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre de la Rutina</Text>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Ej. Pierna Hipertrofia"
                        placeholderTextColor="#666"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <TouchableOpacity onPress={handleSave} style={styles.saveButtonHeader}>
                    <Text style={[styles.saveButtonText, { color: theme }]}>Guardar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Ejercicios ({exercises.length})</Text>

                {exercises.map((item, index) => (
                    <View key={index} style={styles.exerciseCard}>
                        <View style={styles.exerciseHeader}>
                            <Text style={styles.exerciseName}>{item.name}</Text>
                            <TouchableOpacity onPress={() => removeExercise(index)}>
                                <FontAwesome name="times" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.targetsRow}>
                            <View style={styles.targetItem}>
                                <Text style={styles.targetLabel}>Series</Text>
                                <TextInput
                                    style={styles.targetInput}
                                    keyboardType="numeric"
                                    value={item.targetSets}
                                    onChangeText={(val) => updateExercise(index, 'targetSets', val)}
                                />
                            </View>
                            <View style={styles.targetItem}>
                                <Text style={styles.targetLabel}>Reps</Text>
                                <TextInput
                                    style={styles.targetInput}
                                    keyboardType="numeric"
                                    value={item.targetReps}
                                    onChangeText={(val) => updateExercise(index, 'targetReps', val)}
                                />
                            </View>
                            <View style={styles.targetItem}>
                                <Text style={styles.targetLabel}>Peso (kg)</Text>
                                <TextInput
                                    style={styles.targetInput}
                                    keyboardType="numeric"
                                    placeholder="Op."
                                    placeholderTextColor="#666"
                                    value={item.targetWeight}
                                    onChangeText={(val) => updateExercise(index, 'targetWeight', val)}
                                />
                            </View>
                        </View>

                        <TextInput
                            style={styles.notesInput}
                            placeholder="Notas (opcional)"
                            placeholderTextColor="#666"
                            value={item.notes}
                            onChangeText={(val) => updateExercise(index, 'notes', val)}
                        />
                    </View>
                ))}

                <TouchableOpacity
                    style={[styles.addButton, { borderColor: theme }]}
                    onPress={() => setModalVisible(true)}
                >
                    <FontAwesome name="plus" size={16} color={theme} />
                    <Text style={[styles.addButtonText, { color: theme }]}>Añadir Ejercicio</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Exercise Selector Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Añadir Ejercicio</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <FontAwesome name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchBar}>
                            <FontAwesome name="search" size={16} color="#8E8E93" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar..."
                                placeholderTextColor="#8E8E93"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <FlatList
                            data={filteredExercises}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => addExercise(item)}
                                >
                                    <Text style={styles.modalItemText}>{item.name}</Text>
                                    <Text style={styles.modalItemSub}>{item.muscle}</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>No encontrado</Text>
                                    <TouchableOpacity
                                        style={[styles.createButton, { backgroundColor: theme }]}
                                        onPress={handleCreateCustomExercise}
                                    >
                                        <Text style={styles.createButtonText}>Crear "{searchQuery}"</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        padding: 16,
        paddingTop: 10,
        backgroundColor: '#121212',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    nameInput: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        padding: 0,
    },
    saveButtonHeader: {
        padding: 8,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 12,
        fontWeight: '600',
    },
    exerciseCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    targetsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    targetItem: {
        flex: 1,
    },
    targetLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    targetInput: {
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
        padding: 8,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    notesInput: {
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
        padding: 10,
        color: '#fff',
        fontSize: 14,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    addButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
        marginVertical: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    modalItem: {
        paddingVertical: 16,
    },
    modalItemText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500',
    },
    modalItemSub: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#8E8E93',
        marginBottom: 16,
    },
    createButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
