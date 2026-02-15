import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useWorkouts } from '@/context/WorkoutContext';
import { useProgress } from '@/context/ProgressContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TestResult {
    name: string;
    status: 'pending' | 'pass' | 'fail';
    message?: string;
}

export default function TestSuiteScreen() {
    const { theme, themeName, setTheme } = useTheme();
    const { workouts, addWorkout, routines, addRoutine } = useWorkouts();
    const { profile, updateProfile, entries, addEntry } = useProgress();

    const [results, setResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(false);
    const [isWebPlatform, setIsWebPlatform] = useState(false);

    useEffect(() => {
        // Check if running on web
        setIsWebPlatform(Platform.OS === 'web');
    }, []);

    if (isWebPlatform) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>🧪 Test Suite</Text>
                    <Text style={styles.subtitle}>Integration Tests</Text>
                </View>

                <View style={[styles.summary, { backgroundColor: '#ff6b6b' }]}>
                    <Text style={styles.summaryText}>⚠️ Tests disponibles solo en dispositivos</Text>
                </View>

                <View style={styles.webWarning}>
                    <Text style={styles.webWarningTitle}>Requiere Expo Go o dispositivo nativo</Text>
                    <Text style={styles.webWarningText}>
                        Los tests de integración funcionan en:
                    </Text>
                    <Text style={styles.webWarningBullet}>• 📱 Expo Go (Android/iOS)</Text>
                    <Text style={styles.webWarningBullet}>• 🖥️ Emulador Android</Text>
                    <Text style={styles.webWarningBullet}>• 🖥️ Simulador iOS</Text>

                    <Text style={[styles.webWarningText, { marginTop: 20 }]}>
                        Para ejecutar los tests:
                    </Text>
                    <Text style={styles.webWarningStep}>1. Abre la app en Expo Go</Text>
                    <Text style={styles.webWarningStep}>2. Navega a Inicio → Test Suite</Text>
                    <Text style={styles.webWarningStep}>3. Presiona "Ejecutar Tests"</Text>
                </View>
            </ScrollView>
        );
    }

    const runTests = async () => {
        setRunning(true);
        const testResults: TestResult[] = [];

        // Helper function to wait for AsyncStorage
        const waitForUpdate = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Test 1: ThemeContext - Verify AsyncStorage
        try {
            const initialTheme = themeName;
            setTheme('rojo');
            await waitForUpdate(300);

            const storedTheme = await AsyncStorage.getItem('@theme');
            if (storedTheme === 'rojo') {
                testResults.push({ name: 'ThemeContext: Change theme', status: 'pass' });
            } else {
                testResults.push({ name: 'ThemeContext: Change theme', status: 'fail', message: `Stored: ${storedTheme}` });
            }

            setTheme(initialTheme);
        } catch (e: any) {
            testResults.push({ name: 'ThemeContext: Change theme', status: 'fail', message: e.message });
        }

        // Test 2: WorkoutContext - Verify AsyncStorage
        try {
            const testWorkout = {
                id: `test-${Date.now()}`,
                name: 'Test Workout',
                date: new Date().toISOString(),
                timestamp: Date.now(),
                duration: '30 min',
                volume: '500 kg',
                exercises: []
            };

            addWorkout(testWorkout);
            await waitForUpdate(500);

            const stored = await AsyncStorage.getItem('@workouts');
            const storedWorkouts = stored ? JSON.parse(stored) : [];
            const found = storedWorkouts.some((w: any) => w.id === testWorkout.id);

            if (found) {
                testResults.push({ name: 'WorkoutContext: Add workout', status: 'pass' });
            } else {
                testResults.push({ name: 'WorkoutContext: Add workout', status: 'fail', message: `Not found in storage` });
            }
        } catch (e: any) {
            testResults.push({ name: 'WorkoutContext: Add workout', status: 'fail', message: e.message });
        }

        // Test 3: WorkoutContext - Add Routine (verify AsyncStorage)
        try {
            const testRoutine = {
                id: `test-routine-${Date.now()}`,
                name: 'Test Routine',
                createdAt: Date.now(),
                exercises: []
            };

            addRoutine(testRoutine);
            await waitForUpdate(500);

            const stored = await AsyncStorage.getItem('@routines');
            const storedRoutines = stored ? JSON.parse(stored) : [];
            const found = storedRoutines.some((r: any) => r.id === testRoutine.id);

            if (found) {
                testResults.push({ name: 'WorkoutContext: Add routine', status: 'pass' });
            } else {
                testResults.push({ name: 'WorkoutContext: Add routine', status: 'fail', message: `Not found in storage` });
            }
        } catch (e: any) {
            testResults.push({ name: 'WorkoutContext: Add routine', status: 'fail', message: e.message });
        }

        // Test 4: ProgressContext - Update Profile (verify AsyncStorage)
        try {
            const testProfile = {
                age: '30',
                height: '180',
                initialWeight: '80'
            };

            updateProfile(testProfile);
            await waitForUpdate(500);

            const stored = await AsyncStorage.getItem('@user_profile');
            const storedProfile = stored ? JSON.parse(stored) : null;

            if (storedProfile && storedProfile.age === '30') {
                testResults.push({ name: 'ProgressContext: Update profile', status: 'pass' });
            } else {
                testResults.push({ name: 'ProgressContext: Update profile', status: 'fail', message: `Age: ${storedProfile?.age || 'undefined'}` });
            }
        } catch (e: any) {
            testResults.push({ name: 'ProgressContext: Update profile', status: 'fail', message: e.message });
        }

        // Test 5: ProgressContext - Add Entry (verify AsyncStorage)
        try {
            const testEntry = {
                id: `test-entry-${Date.now()}`,
                date: new Date().toISOString(),
                timestamp: Date.now(),
                weight: '75'
            };

            addEntry(testEntry);
            await waitForUpdate(500);

            const stored = await AsyncStorage.getItem('@progress_entries');
            const storedEntries = stored ? JSON.parse(stored) : [];
            const found = storedEntries.some((e: any) => e.id === testEntry.id);

            if (found) {
                testResults.push({ name: 'ProgressContext: Add entry', status: 'pass' });
            } else {
                testResults.push({ name: 'ProgressContext: Add entry', status: 'fail', message: `Not found in storage` });
            }
        } catch (e: any) {
            testResults.push({ name: 'ProgressContext: Add entry', status: 'fail', message: e.message });
        }

        setResults(testResults);
        setRunning(false);

        const passed = testResults.filter(r => r.status === 'pass').length;
        const failed = testResults.filter(r => r.status === 'fail').length;

        Alert.alert(
            'Tests Completados',
            `✅ Pasados: ${passed}\n❌ Fallidos: ${failed}`,
            [{ text: 'OK' }]
        );
    };

    const passedCount = results.filter(r => r.status === 'pass').length;
    const failedCount = results.filter(r => r.status === 'fail').length;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🧪 Test Suite</Text>
                <Text style={styles.subtitle}>Integration Tests</Text>
            </View>

            <TouchableOpacity
                style={[styles.runButton, { backgroundColor: theme }]}
                onPress={runTests}
                disabled={running}
            >
                <Text style={styles.runButtonText}>
                    {running ? '⏳ Ejecutando...' : '▶️ Ejecutar Tests'}
                </Text>
            </TouchableOpacity>

            {results.length > 0 && (
                <View style={styles.summary}>
                    <Text style={styles.summaryText}>
                        ✅ Pasados: {passedCount} | ❌ Fallidos: {failedCount}
                    </Text>
                </View>
            )}

            <View style={styles.results}>
                {results.map((result, index) => (
                    <View key={index} style={styles.testResult}>
                        <View style={styles.testHeader}>
                            <Text style={styles.testStatus}>
                                {result.status === 'pass' ? '✅' : '❌'}
                            </Text>
                            <Text style={styles.testName}>{result.name}</Text>
                        </View>
                        {result.message && (
                            <Text style={styles.testMessage}>{result.message}</Text>
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
        marginTop: 5,
    },
    runButton: {
        margin: 20,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    runButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    summary: {
        marginHorizontal: 20,
        padding: 15,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        marginBottom: 10,
    },
    summaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    results: {
        padding: 20,
    },
    testResult: {
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    testHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    testStatus: {
        fontSize: 20,
        marginRight: 10,
    },
    testName: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    testMessage: {
        color: '#ff6b6b',
        fontSize: 14,
        marginTop: 8,
        marginLeft: 30,
    },
    webWarning: {
        margin: 20,
        padding: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ff6b6b',
    },
    webWarningTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    webWarningText: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 24,
    },
    webWarningBullet: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 5,
    },
    webWarningStep: {
        color: '#00D9FF',
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 8,
    },
});
