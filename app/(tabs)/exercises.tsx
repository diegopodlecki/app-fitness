import React, { useState } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { exercisesData } from '@/constants/data';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/context/ThemeContext';

const filters = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

export default function ExercisesScreen() {
    const { theme } = useTheme();
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercise, setSelectedExercise] = useState<any>(null); // For detail modal

    const filteredExercises = exercisesData.filter(ex => {
        // Only verify primary muscle for simplicity in filtering
        const matchesFilter = activeFilter === 'Todos' || ex.muscle === activeFilter;
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const onSelectExercise = (item: any) => {
        setSelectedExercise(item);
    };

    const closeModal = () => {
        setSelectedExercise(null);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Principiante': return '#34C759'; // Green - keep fixed for meaning
            case 'Intermedio': return '#FF9500'; // Orange - keep fixed for meaning
            case 'Avanzado': return '#FF3B30'; // Red - keep fixed for meaning
            default: return '#8E8E93';
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} onPress={() => onSelectExercise(item)}>
            <View style={styles.cardContent}>
                <View style={styles.topRow}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <View style={[styles.badge, { backgroundColor: getLevelColor(item.level) + '20' }]}>
                        <Text style={[styles.badgeText, { color: getLevelColor(item.level) }]}>
                            {item.level}
                        </Text>
                    </View>
                </View>
                <Text style={styles.exerciseDetail}>{item.muscle} • {item.equipment}</Text>
            </View>
            <FontAwesome name="chevron-right" size={12} color="#666" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Biblioteca</Text>

                <View style={styles.searchBar}>
                    <FontAwesome name="search" size={16} color="#8E8E93" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar ejercicio..."
                        placeholderTextColor="#8E8E93"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterChip,
                                activeFilter === filter && { backgroundColor: theme, borderColor: theme }
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === filter && styles.activeFilterText
                            ]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredExercises}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            {/* Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!selectedExercise}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalInternal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderTitle}>Detalle</Text>
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <FontAwesome name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {selectedExercise && (
                            <ScrollView style={styles.modalBody}>
                                <Text style={styles.detailTitle}>{selectedExercise.name}</Text>

                                <View style={styles.tagRow}>
                                    <View style={[styles.badge, { backgroundColor: theme + '20' }]}>
                                        <Text style={[styles.badgeText, { color: theme }]}>{selectedExercise.muscle}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: getLevelColor(selectedExercise.level) + '20' }]}>
                                        <Text style={[styles.badgeText, { color: getLevelColor(selectedExercise.level) }]}>
                                            {selectedExercise.level}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Cómo se hace</Text>
                                    <Text style={styles.sectionText}>{selectedExercise.description}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Músculos Secundarios</Text>
                                    <Text style={styles.sectionText}>
                                        {selectedExercise.secondaryMuscles && selectedExercise.secondaryMuscles.length > 0
                                            ? selectedExercise.secondaryMuscles.join(', ')
                                            : 'Ninguno'
                                        }
                                    </Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Beneficios</Text>
                                    <Text style={styles.sectionText}>{selectedExercise.benefits}</Text>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark Grey Background
    },
    header: {
        backgroundColor: '#121212', // Dark Grey Header
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff', // White Text
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E', // Dark Grey Search
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
        color: '#fff', // White Text
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1C1C1E', // Dark Grey Chip
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    // activeFilterChip handled inline
    filterText: {
        fontSize: 14,
        color: '#fff', // White Text
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#1C1C1E', // Dark Grey Card
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    cardContent: {
        flex: 1,
        marginRight: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff', // White Text
        flex: 1,
    },
    exerciseDetail: {
        fontSize: 14,
        color: '#8E8E93', // Grey Details
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    modalInternal: {
        backgroundColor: '#1C1C1E', // Dark Modal Body
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '90%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 15,
    },
    modalHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    closeButton: {
        padding: 5,
    },
    modalBody: {
        flex: 1,
    },
    detailTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 25,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 16,
        color: '#ccc', // Light Grey Text
        lineHeight: 24,
    },
});
