import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/context/ThemeContext';

const PRESETS = [30, 60, 90, 120, 180];

export default function RestScreen() {
    const { theme } = useTheme();
    const [timeLeft, setTimeLeft] = useState(90); // Default 1:30
    const [isActive, setIsActive] = useState(false);
    const [initialTime, setInitialTime] = useState(90);
    const [modalVisible, setModalVisible] = useState(false);
    const [customTimeInput, setCustomTimeInput] = useState('');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play sound or vibrate here
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const setPreset = (seconds: number) => {
        setInitialTime(seconds);
        setTimeLeft(seconds);
        setIsActive(true);
    };

    const addTime = (seconds: number) => {
        setTimeLeft((prev) => prev + seconds);
    };

    const handleCustomTime = () => {
        const seconds = parseInt(customTimeInput, 10);
        if (!isNaN(seconds) && seconds > 0) {
            setPreset(seconds);
            setModalVisible(false);
            setCustomTimeInput('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Temporizador</Text>

            <View style={styles.timerContainer}>
                <TouchableOpacity
                    style={[styles.circle, { borderColor: theme }]}
                    onPress={toggleTimer}
                >
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    <Text style={styles.subText}>{isActive ? 'Pausar' : 'Iniciar'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
                    <FontAwesome name="refresh" size={20} color="#8E8E93" />
                    <Text style={styles.controlLabel}>Reiniciar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlButton, styles.playButton, { backgroundColor: theme }]}
                    onPress={toggleTimer}
                >
                    <FontAwesome name={isActive ? "pause" : "play"} size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={() => setModalVisible(true)}>
                    <FontAwesome name="pencil" size={20} color="#8E8E93" />
                    <Text style={styles.controlLabel}>Editar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.adjustRow}>
                <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(30)}>
                    <Text style={styles.adjustText}>+30s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(60)}>
                    <Text style={styles.adjustText}>+1m</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.presetsGrid}>
                <Text style={styles.sectionLabel}>Prestables</Text>
                <View style={styles.presetsRow}>
                    {PRESETS.map((seconds) => (
                        <TouchableOpacity
                            key={seconds}
                            style={[
                                styles.presetButton,
                                initialTime === seconds && { backgroundColor: theme, borderColor: theme }
                            ]}
                            onPress={() => setPreset(seconds)}
                        >
                            <Text style={[styles.presetText, initialTime === seconds && styles.activePresetText]}>
                                {seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tiempo Personalizado</Text>
                        <Text style={styles.modalSub}>Ingresa la duración en segundos</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ej. 45"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            value={customTimeInput}
                            onChangeText={setCustomTimeInput}
                            autoFocus={true}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtnConfirm, { backgroundColor: theme }]} onPress={handleCustomTime}>
                                <Text style={styles.modalBtnTextConfirm}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark Grey Background
        alignItems: 'center',
        paddingVertical: 50,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff', // White Text
        marginBottom: 40,
    },
    timerContainer: {
        marginBottom: 40,
    },
    circle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 8,
        // borderColor: '#007AFF', // Handled by theme
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1C1E', // Dark Grey Circle Background
    },
    timerText: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#fff', // White Text
        fontVariant: ['tabular-nums'],
    },
    subText: {
        fontSize: 18,
        color: '#8E8E93',
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        marginBottom: 30,
    },
    controlButton: {
        alignItems: 'center',
    },
    controlLabel: {
        color: '#8E8E93',
        fontSize: 12,
        marginTop: 6,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        // backgroundColor: '#007AFF', // Handled by theme
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10, // Slight visual lift
    },
    adjustRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 40,
    },
    adjustButton: {
        backgroundColor: '#1C1C1E', // Dark Grey Button
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    adjustText: {
        color: '#fff', // White Text
        fontWeight: '600',
        fontSize: 16,
    },
    presetsGrid: {
        width: '100%',
        paddingHorizontal: 30,
    },
    sectionLabel: {
        color: '#8E8E93',
        fontSize: 14,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    presetsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    presetButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1C1C1E', // Dark Grey
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    // activePreset styles handled inline with theme
    presetText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    activePresetText: {
        color: '#fff',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#1C1C1E', // Dark Grey Modal
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        color: '#fff', // White Text
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalSub: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#2C2C2E', // Darker Grey Input
        borderRadius: 10,
        color: '#fff', // White Text
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalBtnCancel: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#2C2C2E',
        alignItems: 'center',
    },
    modalBtnConfirm: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        // backgroundColor: '#007AFF', // Handled by theme
        alignItems: 'center',
    },
    modalBtnTextCancel: {
        color: '#fff',
        fontWeight: '600',
    },
    modalBtnTextConfirm: {
        color: '#fff',
        fontWeight: '600',
    },
});
