import { Alert, LogBox } from 'react-native';

/**
 * Professional Error Service
 * This handles logging to Sentry (future) and showing user-friendly alerts.
 */
class ErrorService {
    /**
     * Handle an error by logging it and optionally showing an alert to the user.
     * @param error The error object or message
     * @param userMessage A friendly message for the user
     * @param silent If true, only logs to console/Sentry without showing an Alert
     */
    static handle(error: any, userMessage: string = 'Ha ocurrido un error inesperado.', silent: boolean = false) {
        // 1. Log to console
        console.error(`[ErrorService]: ${userMessage}`, error);

        // 2. Log to Sentry (Placeholder for when Sentry is initialized)
        // if (Sentry) Sentry.captureException(error);

        // 3. Show Alert to user
        if (!silent) {
            Alert.alert(
                'Oops!',
                userMessage,
                [{ text: 'Entendido' }]
            );
        }
    }

    /**
     * Log a non-critical error or warning.
     */
    static warn(message: string, data?: any) {
        console.warn(`[ErrorService Warning]: ${message}`, data);
    }
}

export default ErrorService;
