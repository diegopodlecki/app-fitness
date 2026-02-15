import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert, View as DefaultView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useWorkouts, Routine } from '@/context/WorkoutContext';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RoutinesListScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { routines, deleteRoutine } = useWorkouts();

    const handleDelete = (id: string) => {
        Alert.alert(
            "Eliminar Rutina",
            "¿Estás seguro de que quieres eliminar esta rutina?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => deleteRoutine(id)
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Routine }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/routines/editor', params: { id: item.id } })}
        >
            <DefaultView style={styles.cardHeader}>
                <DefaultView style={[styles.iconContainer, { backgroundColor: theme + '20' }]}>
                    <FontAwesome name="list-alt" size={26} color={theme} />
                </DefaultView>
                <DefaultView style={styles.cardContent}>
                    <Text style={styles.routineName}>{item.name}</Text>
                    <Text style={styles.routineSub}>
                        {item.exercises.length} Ejercicios
                    </Text>
                </DefaultView>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <FontAwesome name="trash-o" size={22} color="#FF3B30" />
                </TouchableOpacity>
            </DefaultView>
            <DefaultView style={styles.exerciseList}>
                <Text style={styles.exercisePreview} numberOfLines={1}>
                    {item.exercises.map(e => e.name).join(', ')}
                </Text>
            </DefaultView>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {routines.length === 0 ? (
                <View style={styles.emptyState}>
                    <FontAwesome name="clipboard" size={64} color="#333" />
                    <Text style={styles.emptyText}>No tienes rutinas creadas</Text>
                    <Text style={styles.emptySub}>Crea una rutina personalizada para agilizar tus entrenamientos.</Text>
                </View>
            ) : (
                <FlatList
                    data={routines}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            )}

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme }]}
                onPress={() => router.push('/routines/editor')}
            >
                <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    list: {
        padding: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
    },
    emptySub: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: 10,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    routineName: {
        fontSize: 20, // +2
        fontWeight: '600',
        color: '#fff',
    },
    routineSub: {
        fontSize: 16, // +2
        color: '#aaa',
        marginTop: 2,
    },
    deleteButton: {
        padding: 8,
    },
    exerciseList: {
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 12,
    },
    exercisePreview: {
        fontSize: 14,
        color: '#8E8E93',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
