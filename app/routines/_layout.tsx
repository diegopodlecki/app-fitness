import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function RoutinesLayout() {
    const { theme } = useTheme();

    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: '#121212' },
        }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Mis Rutinas',
                    headerBackTitle: 'Atrás'
                }}
            />
            <Stack.Screen
                name="editor"
                options={{
                    title: 'Editar Rutina',
                    presentation: 'modal', // Open as modal for better UX
                    headerBackTitle: 'Cancelar'
                }}
            />
        </Stack>
    );
}
