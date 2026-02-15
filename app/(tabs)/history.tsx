import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ScrollView, View as DefaultView } from 'react-native';
import { View, Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useWorkouts, Workout } from '@/context/WorkoutContext';
import { useTheme } from '@/context/ThemeContext';

export default function HistoryScreen() {
    const { workouts } = useWorkouts();
    const { theme } = useTheme();

    // State to track expanded items
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const renderWorkout = ({ item }: { item: Workout }) => {
        const isExpanded = expandedIds.has(item.id);

        return (
            <View style={[styles.card, { backgroundColor: theme }]}>
                <TouchableOpacity
                    style={styles.cardHeader}
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.7}
                >
                    <DefaultView style={styles.headerLeft}>
                        <Text style={styles.workoutName}>{item.name}</Text>
                        <Text style={styles.workoutDate}>{item.date}</Text>
                    </DefaultView>
                    <DefaultView style={styles.headerRight}>
                        <DefaultView style={styles.statBadge}>
                            <FontAwesome name="clock-o" size={14} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={styles.statText}>{item.duration}</Text>
                        </DefaultView>
                        <DefaultView style={styles.statBadge}>
                            <FontAwesome name="database" size={14} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={styles.statText}>{item.volume}</Text>
                        </DefaultView>
                        <FontAwesome
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={14}
                            color="#fff" // White arrow on colored background
                            style={{ marginLeft: 10 }}
                        />
                    </DefaultView>
                </TouchableOpacity>

                {isExpanded && (
                    <DefaultView style={styles.detailsContainer}>
                        <DefaultView style={styles.divider} />
                        {item.exercises.map((ex, index) => (
                            <DefaultView key={`${ex.id}-${index}`} style={styles.exerciseRow}>
                                <Text style={styles.exerciseName}>{ex.name}</Text>
                                <DefaultView style={styles.setsContainer}>
                                    {ex.sets.filter(s => s.completed).map((set, sIndex) => (
                                        <Text key={sIndex} style={styles.setText}>
                                            {sIndex + 1}. <Text style={{ fontWeight: 'bold' }}>{set.weight}kg</Text> x {set.reps}
                                        </Text>
                                    ))}
                                </DefaultView>
                            </DefaultView>
                        ))}
                    </DefaultView>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial</Text>

            {workouts.length === 0 ? (
                <View style={styles.emptyState}>
                    <FontAwesome name="history" size={48} color="#666" />
                    <Text style={styles.emptyText}>No hay entrenamientos guardados aún.</Text>
                </View>
            ) : (
                <FlatList
                    data={workouts}
                    renderItem={renderWorkout}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark Grey Background
        paddingTop: 50,
    },
    title: {
        fontSize: 30, // +2
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 10,
        color: '#fff',
    },
    list: {
        padding: 16,
    },
    card: {
        borderRadius: 14, // Slightly rounder
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 18, // +padding
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
    },
    workoutName: {
        fontSize: 18, // +2
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    workoutDate: {
        fontSize: 14, // +2
        color: 'rgba(255,255,255,0.8)',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent white
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statText: {
        fontSize: 12,
        color: '#fff', // White Text
        fontWeight: '500',
    },
    detailsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 12,
    },
    exerciseRow: {
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff', // White Text
        marginBottom: 4,
    },
    setsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    setText: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8E8E93',
    },
});
