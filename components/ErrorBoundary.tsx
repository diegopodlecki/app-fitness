import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View, TouchableOpacity, Text as RNText } from 'react-native';
import { Text } from '@/components/Themed';
import ErrorService from '@/services/ErrorService';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Professional Error Boundary
 * Catches JS crashes in the component tree and shows a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to our professional ErrorService
        ErrorService.handle(error, 'La aplicación ha experimentado un problema visual.', true);
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback as any;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.card}>
                        <Text style={styles.icon}>⚠️</Text>
                        <Text style={styles.title}>¡Algo salió mal!</Text>
                        <Text style={styles.message}>
                            La aplicación encontró un error inesperado. Hemos sido notificados y estamos trabajando en ello.
                        </Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.handleReset}
                        >
                            <RNText style={styles.buttonText}>Reintentar</RNText>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#1e1e1e',
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    icon: {
        fontSize: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#b0b0b0',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#2F80ED',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
