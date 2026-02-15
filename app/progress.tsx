import React, { useState } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal, Image, Alert, FlatList } from 'react-native';
import { View, Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useProgress, ProgressEntry } from '@/context/ProgressContext';
import { useTheme } from '@/context/ThemeContext';

export default function ProgressScreen() {
    const { entries, addEntry, removeEntry } = useProgress();
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [weight, setWeight] = useState('');
    // New Detailed Measurements
    const [neck, setNeck] = useState('');
    const [shoulders, setShoulders] = useState('');
    const [chest, setChest] = useState('');
    const [waist, setWaist] = useState('');
    const [hips, setHips] = useState('');
    const [bicepLeft, setBicepLeft] = useState('');
    const [bicepRight, setBicepRight] = useState('');
    const [forearmLeft, setForearmLeft] = useState('');
    const [forearmRight, setForearmRight] = useState('');
    const [thighLeft, setThighLeft] = useState('');
    const [thighRight, setThighRight] = useState('');
    const [quadLeft, setQuadLeft] = useState('');
    const [quadRight, setQuadRight] = useState('');
    const [calfLeft, setCalfLeft] = useState('');
    const [calfRight, setCalfRight] = useState('');

    const [photo, setPhoto] = useState<string | null>(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!weight) {
            Alert.alert("Faltan datos", "Por favor ingresa al menos el peso.");
            return;
        }

        const newEntry: ProgressEntry = {
            id: Math.random().toString(),
            date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            timestamp: Date.now(),
            weight,
            neck, shoulders, chest, waist, hips,
            bicepLeft, bicepRight,
            forearmLeft, forearmRight,
            thighLeft, thighRight,
            quadLeft, quadRight,
            calfLeft, calfRight,
            photoUri: photo || undefined
        };

        addEntry(newEntry);
        setModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setWeight('');
        setNeck(''); setShoulders(''); setChest(''); setWaist(''); setHips('');
        setBicepLeft(''); setBicepRight(''); setForearmLeft(''); setForearmRight('');
        setThighLeft(''); setThighRight(''); setQuadLeft(''); setQuadRight('');
        setCalfLeft(''); setCalfRight('');
        setPhoto(null);
    };

    // Chart Logic (Simple Bar Chart)
    const maxWeight = Math.max(...entries.map(e => parseFloat(e.weight) || 0), 100);
    const minWeight = Math.min(...entries.map(e => parseFloat(e.weight) || 0), 0);

    // Sort entries by date ascending for chart
    const chartData = [...entries].sort((a, b) => a.timestamp - b.timestamp).slice(-7); // Last 7 entries

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Peso Actual</Text>
                        <Text style={styles.statValue}>
                            {entries.length > 0 ? `${entries[0].weight} kg` : '--'}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Inicio</Text>
                        <Text style={styles.statValue}>
                            {entries.length > 0 ? `${entries[entries.length - 1].weight} kg` : '--'}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Cambio</Text>
                        <Text style={[styles.statValue, { color: '#34C759' }]}>
                            {entries.length >= 2
                                ? `${(parseFloat(entries[0].weight) - parseFloat(entries[entries.length - 1].weight)).toFixed(1)} kg`
                                : '--'}
                        </Text>
                    </View>
                </View>

                {/* Chart */}
                {entries.length > 1 && (
                    <View style={styles.chartContainer}>
                        <Text style={styles.sectionTitle}>Evolución (Peso)</Text>
                        <View style={styles.chart}>
                            {chartData.map((item, index) => {
                                const w = parseFloat(item.weight);
                                const heightPercentage = ((w - (minWeight - 5)) / (maxWeight - (minWeight - 5))) * 100;
                                return (
                                    <View key={item.id} style={styles.barContainer}>
                                        <Text style={styles.barLabel}>{w}</Text>
                                        <View style={[styles.bar, { height: `${Math.max(heightPercentage, 10)}%`, backgroundColor: theme }]} />
                                        <Text style={styles.barDate}>{item.date}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Photos Gallery */}
                <View style={styles.galleryContainer}>
                    <Text style={styles.sectionTitle}>Galería</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                        <TouchableOpacity style={styles.addPhotoButton} onPress={() => setModalVisible(true)}>
                            <FontAwesome name="camera" size={24} color={theme} />
                            <Text style={[styles.addPhotoText, { color: theme }]}>Añadir</Text>
                        </TouchableOpacity>
                        {entries.filter(e => e.photoUri).map(entry => (
                            <View key={entry.id} style={styles.photoItem}>
                                <Image source={{ uri: entry.photoUri }} style={styles.photo} />
                                <Text style={styles.photoDate}>{entry.date}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* History List */}
                <View style={styles.historyContainer}>
                    <Text style={styles.sectionTitle}>Historial</Text>
                    {entries.map(entry => (
                        <View key={entry.id} style={styles.historyItem}>
                            <View>
                                <Text style={styles.historyDate}>{entry.date}</Text>
                                <Text style={styles.historySub}>
                                    {entry.waist ? `Cintura: ${entry.waist}cm ` : ''}
                                    {entry.chest ? `Pecho: ${entry.chest}cm` : ''}
                                </Text>
                            </View>
                            <View style={styles.historyRight}>
                                <Text style={[styles.historyWeight, { color: theme }]}>{entry.weight} kg</Text>
                                <TouchableOpacity onPress={() => removeEntry(entry.id)}>
                                    <FontAwesome name="trash-o" size={16} color="#FF3B30" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={[styles.fab, { backgroundColor: theme }]} onPress={() => setModalVisible(true)}>
                <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nuevo Registro</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <FontAwesome name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <Text style={styles.inputLabel}>Peso (kg) *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. 75.5"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={weight}
                                onChangeText={setWeight}
                            />

                            <Text style={[styles.sectionHeader, { color: theme, marginTop: 10 }]}>Torso</Text>
                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Cuello (cm)" placeholderTextColor="#666" value={neck} onChangeText={setNeck} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Hombros (cm)" placeholderTextColor="#666" value={shoulders} onChangeText={setShoulders} keyboardType="numeric" />
                            </View>
                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Pecho (cm)" placeholderTextColor="#666" value={chest} onChangeText={setChest} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Cintura (cm)" placeholderTextColor="#666" value={waist} onChangeText={setWaist} keyboardType="numeric" />
                            </View>
                            <TextInput style={styles.input} placeholder="Cadera (cm)" placeholderTextColor="#666" value={hips} onChangeText={setHips} keyboardType="numeric" />

                            <Text style={[styles.sectionHeader, { color: theme }]}>Brazos (Izq / Der)</Text>
                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Bíceps Izq" placeholderTextColor="#666" value={bicepLeft} onChangeText={setBicepLeft} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Bíceps Der" placeholderTextColor="#666" value={bicepRight} onChangeText={setBicepRight} keyboardType="numeric" />
                            </View>
                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Antebrazo Izq" placeholderTextColor="#666" value={forearmLeft} onChangeText={setForearmLeft} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Antebrazo Der" placeholderTextColor="#666" value={forearmRight} onChangeText={setForearmRight} keyboardType="numeric" />
                            </View>

                            <Text style={[styles.sectionHeader, { color: theme }]}>Piernas (Izq / Der)</Text>
                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Muslo Izq" placeholderTextColor="#666" value={thighLeft} onChangeText={setThighLeft} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Muslo Der" placeholderTextColor="#666" value={thighRight} onChangeText={setThighRight} keyboardType="numeric" />
                            </View>
                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Cuádriceps Izq" placeholderTextColor="#666" value={quadLeft} onChangeText={setQuadLeft} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Cuádriceps Der" placeholderTextColor="#666" value={quadRight} onChangeText={setQuadRight} keyboardType="numeric" />
                            </View>
                            <View style={styles.row}>
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Pantorrilla Izq" placeholderTextColor="#666" value={calfLeft} onChangeText={setCalfLeft} keyboardType="numeric" />
                                <TextInput style={[styles.input, styles.halfInput]} placeholder="Pantorrilla Der" placeholderTextColor="#666" value={calfRight} onChangeText={setCalfRight} keyboardType="numeric" />
                            </View>

                            <TouchableOpacity style={[styles.photoButton, { backgroundColor: theme + 'CC' }]} onPress={pickImage}>
                                <FontAwesome name={photo ? "refresh" : "camera"} size={16} color="#fff" />
                                <Text style={styles.photoButtonText}>
                                    {photo ? "Cambiar Foto" : "Añadir Foto"}
                                </Text>
                            </TouchableOpacity>

                            {photo && (
                                <Image source={{ uri: photo }} style={styles.previewImage} />
                            )}

                            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme }]} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </ScrollView>
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
    scrollContent: {
        padding: 20,
        paddingBottom: 80,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1C1C1E', // Dark Grey Card
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // White Text
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#fff', // White Text
    },
    chartContainer: {
        backgroundColor: '#1C1C1E', // Dark Grey Card
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        height: 200,
    },
    chart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingBottom: 10,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 12,
        // backgroundColor: '#007AFF', // Handled by theme
        borderRadius: 6,
        marginBottom: 4,
    },
    barDate: {
        fontSize: 10,
        color: '#8E8E93',
    },
    barLabel: {
        fontSize: 10,
        color: '#fff', // White Text
        marginBottom: 2,
    },
    galleryContainer: {
        marginBottom: 20,
    },
    photosScroll: {
        flexDirection: 'row',
    },
    addPhotoButton: {
        width: 100,
        height: 140,
        backgroundColor: '#1C1C1E', // Dark Grey
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    addPhotoText: {
        marginTop: 8,
        color: '#007AFF',
        fontSize: 14,
    },
    photoItem: {
        marginRight: 10,
    },
    photo: {
        width: 100,
        height: 140,
        borderRadius: 10,
    },
    photoDate: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        fontSize: 10,
        textAlign: 'center',
        paddingVertical: 2,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    historyContainer: {
        backgroundColor: '#1C1C1E', // Dark Grey Card
        borderRadius: 12,
        padding: 16,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    historyDate: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff', // White Text
    },
    historySub: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2,
    },
    historyRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyWeight: {
        fontSize: 16,
        fontWeight: 'bold',
        // color: '#007AFF', // Handled by theme
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        // backgroundColor: '#007AFF', // Handled by theme
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    // Modal
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    modalContent: {
        backgroundColor: '#1C1C1E', // Dark Modal
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
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // White Text
    },
    inputLabel: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#2C2C2E', // Dark Input
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#fff', // White Text
    },
    photoButton: {
        backgroundColor: '#5856D6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
    },
    photoButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    saveButton: {
        // backgroundColor: '#007AFF', // Handled by theme
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // New Styles
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 10,
    },
    halfInput: {
        flex: 1,
    },
});
