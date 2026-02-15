import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView, Modal, Dimensions, TextInput } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useWorkouts } from '@/context/WorkoutContext';
import { useProgress } from '@/context/ProgressContext';
import { useTheme, THEMES, ThemeKey } from '@/context/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { workouts } = useWorkouts();
  const { theme, setTheme, themeName } = useTheme();
  const { profile, updateProfile } = useProgress();

  const [guideVisible, setGuideVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  // Profile Form State
  const [editHeight, setEditHeight] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editAge, setEditAge] = useState('');

  const handleOpenProfile = () => {
    if (profile) {
      setEditHeight(profile.height);
      setEditWeight(profile.initialWeight);
      setEditAge(profile.age);
    }
    setProfileVisible(true);
  };

  const handleSaveProfile = () => {
    updateProfile({
      height: editHeight,
      age: editAge,
      initialWeight: editWeight
    });
    setProfileVisible(false);
  };

  const calculateBMI = () => {
    if (!profile || !profile.height || !profile.initialWeight) return null;
    const hM = parseFloat(profile.height) / 100;
    const wKg = parseFloat(profile.initialWeight);
    if (!hM || !wKg) return null;
    return (wKg / (hM * hM)).toFixed(1);
  };

  const getBMIStatus = (bmi: string | null) => {
    if (!bmi) return '';
    const num = parseFloat(bmi);
    if (num < 18.5) return 'Bajo peso';
    if (num < 25) return 'Normal';
    if (num < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const bmi = calculateBMI();
  const bmiStatus = getBMIStatus(bmi);

  // Derived State
  const lastWorkout = workouts.length > 0 ? workouts[0] : null;

  const getWorkoutsThisWeek = () => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    return workouts.filter(w => w.timestamp > oneWeekAgo).length;
  };

  const getRestStatus = () => {
    if (!lastWorkout) return 'Listo para entrenar';
    const now = new Date();
    const last = new Date(lastWorkout.timestamp);
    const isToday = now.getDate() === last.getDate() &&
      now.getMonth() === last.getMonth() &&
      now.getFullYear() === last.getFullYear();

    return isToday ? 'Recuperando' : 'Listo para entrenar';
  };

  const getRecentExercises = () => {
    if (!lastWorkout) return 'Sin actividad reciente';
    const names = lastWorkout.exercises.map(e => e.name);
    return names.slice(0, 3).join(', ') + (names.length > 3 ? '...' : '');
  };

  const Card = ({ title, icon, color, children, onPress }: any) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <DefaultView style={styles.iconContainer}>
        <FontAwesome name={icon} size={26} color="#fff" />
      </DefaultView>
      <DefaultView style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
      </DefaultView>
      <FontAwesome name="chevron-right" size={18} color="rgba(255,255,255,0.5)" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Hola, Diego 👋</Text>
      <Text style={styles.headerSubtitle}>Listo para entrenar hoy?</Text>

      {/* Quick Guide Button */}
      <TouchableOpacity
        style={[styles.guideButton, { borderColor: theme }]}
        onPress={() => setGuideVisible(true)}
      >
        <FontAwesome name="info-circle" size={20} color={theme} />
        <Text style={[styles.guideText, { color: theme }]}>¿Cómo crear mi rutina semanal?</Text>
      </TouchableOpacity>

      {/* Theme Selector */}
      <View style={styles.themeSection}>
        <Text style={styles.sectionTitle}>Personaliza tu estilo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeScroll}>
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.themeCircle,
                { backgroundColor: THEMES[key].color },
                themeName === key && styles.activeThemeCircle
              ]}
              onPress={() => setTheme(key)}
            >
              {themeName === key && <FontAwesome name="check" size={14} color="#fff" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen</Text>

        {/* Profile Card */}
        <Card
          title="Mi Perfil"
          icon="user"
          color="#5856D6" // Indigo
          onPress={handleOpenProfile}
        >
          {profile ? (
            <>
              <Text style={styles.cardTextBold}>IMC: {bmi || '--'} ({bmiStatus})</Text>
              <Text style={styles.cardText}>{profile.height}cm • {profile.age} años</Text>
            </>
          ) : (
            <Text style={styles.cardTextBold}>Configurar Perfil</Text>
          )}
        </Card>

        <Card
          title="Último Entrenamiento"
          icon="check-circle"
          color="#4CD964" // Green for success
          onPress={() => router.push('/(tabs)/history')}
        >
          {lastWorkout ? (
            <>
              <Text style={styles.cardTextBold}>{lastWorkout.name}</Text>
              <Text style={styles.cardText}>{lastWorkout.date} • {lastWorkout.duration}</Text>
            </>
          ) : (
            <Text style={styles.cardText}>Sin entrenamientos recientes</Text>
          )}
        </Card>

        <Card
          title="Esta Semana"
          icon="calendar"
          color={theme} // Use Theme Color
          onPress={() => router.push('/(tabs)/history')}
        >
          <Text style={styles.cardTextBold}>{getWorkoutsThisWeek()} entrenamientos</Text>
          <Text style={styles.cardText}>Sigue así!</Text>
        </Card>

        <Card
          title="Estado"
          icon="battery-3"
          color="#FF9500" // Orange for caution/status
          onPress={() => router.push('/(tabs)/rest')}
        >
          <Text style={styles.cardTextBold}>{getRestStatus()}</Text>
          <Text style={styles.cardText}>
            {getRestStatus() === 'Recuperando' ? 'Descanso activo' : 'A darle duro'}
          </Text>
        </Card>

        <Card
          title="Progreso"
          icon="line-chart"
          color={theme} // Use Theme Color
          onPress={() => router.push('/progress')}
        >
          <Text style={styles.cardTextBold}>Registrar peso y fotos</Text>
          <Text style={styles.cardText}>Ver evolución</Text>
        </Card>

        <Card
          title="Recientes"
          icon="bolt"
          color="#FF2D55" // Red
          onPress={() => router.push('/(tabs)/exercises')}
        >
          <Text style={styles.cardText}>{getRecentExercises()}</Text>
        </Card>

        {/* Test Suite Card */}
        <Card
          title="🧪 Test Suite"
          icon="check-circle"
          color="#00D9FF"
          onPress={() => router.push('/test-suite')}
        >
          <Text style={styles.cardTextBold}>Tests de Integración</Text>
          <Text style={styles.cardText}>Validar arquitectura SQLite</Text>
        </Card>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={guideVisible}
        onRequestClose={() => setGuideVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Guía de Inicio Rápido 🚀</Text>
              <TouchableOpacity onPress={() => setGuideVisible(false)}>
                <FontAwesome name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.guideStepTitle}>Paso 1: Organiza tu Semana</Text>
              <Text style={styles.guideStepText}>
                Lo ideal es dividir tus entrenamientos por días. Por ejemplo:
                {"\n"}• Lunes: Pecho
                {"\n"}• Miércoles: Espalda
                {"\n"}• Viernes: Pierna
              </Text>

              <Text style={styles.guideStepTitle}>Paso 2: Crea tus Rutinas</Text>
              <Text style={styles.guideStepText}>
                1. Ve a la pestaña <Text style={{ fontWeight: 'bold', color: theme }}>Entrenar</Text>.
                {"\n"}2. Toca en "Gestionar Rutinas".
                {"\n"}3. Crea una rutina para cada día (ej: "Día 1 - Pecho").
                {"\n"}4. Añade los ejercicios que planeas hacer.
              </Text>

              <Text style={styles.guideStepTitle}>Paso 3: ¡A Entrenar!</Text>
              <Text style={styles.guideStepText}>
                Cada día que vayas al gimnasio:
                {"\n"}1. Abre la app y ve a <Text style={{ fontWeight: 'bold', color: theme }}>Entrenar</Text>.
                {"\n"}2. Verás tu lista en "MIS RUTINAS".
                {"\n"}3. Toca la rutina del día y empieza. ¡Así de fácil!
              </Text>

              <TouchableOpacity
                style={[styles.closeGuideButton, { backgroundColor: theme }]}
                onPress={() => setGuideVisible(false)}
              >
                <Text style={styles.closeGuideText}>¡Entendido!</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileVisible}
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mi Perfil 👤</Text>
              <TouchableOpacity onPress={() => setProfileVisible(false)}>
                <FontAwesome name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Edad (años)</Text>
                <TextInput
                  style={styles.input}
                  value={editAge}
                  onChangeText={setEditAge}
                  placeholder="Ej: 25"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Altura (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={editHeight}
                  onChangeText={setEditHeight}
                  placeholder="Ej: 175"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Peso Actual (kg) - Para IMC</Text>
                <TextInput
                  style={styles.input}
                  value={editWeight}
                  onChangeText={setEditWeight}
                  placeholder="Ej: 75.5"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.bmiInfo}>
                <Text style={styles.bmiTitle}>¿Qué es el IMC?</Text>
                <Text style={styles.bmiText}>
                  El Índice de Masa Corporal es una referencia para saber tu estado nutricional.
                  Se calcula a partir de tu peso y altura.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme }]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Guardar Perfil</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark Grey Background
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 30, // +2
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 18, // +2
    color: '#aaa',
    marginBottom: 20,
  },
  section: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 20, // +2
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  card: {
    borderRadius: 16,
    padding: 18, // Slightly larger padding
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16, // +2
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  cardTextBold: {
    fontSize: 18, // +2
    fontWeight: 'bold',
    color: '#fff',
  },
  cardText: {
    fontSize: 16, // +2
    color: '#fff',
  },
  chevron: {
    marginLeft: 10,
  },
  // Theme Selector
  themeSection: {
    marginBottom: 20,
  },
  themeScroll: {
    flexDirection: 'row',
  },
  themeCircle: {
    width: 44, // Larger tap target
    height: 44,
    borderRadius: 22,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  activeThemeCircle: {
    borderColor: '#fff',
    borderWidth: 3,
  },
  // Guide
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  guideText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  guideStepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  guideStepText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  closeGuideButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeGuideText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Form Styles
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 18,
  },
  saveButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bmiInfo: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  bmiTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bmiText: {
    color: '#aaa',
    lineHeight: 20,
  }
});
