export interface ProgressEntry {
    id: string;
    date: string;
    timestamp: number;
    weight: string; // kg

    // Detailed Measurements
    neck?: string;
    shoulders?: string;
    chest?: string;
    waist?: string;
    hips?: string;
    bicepLeft?: string;
    bicepRight?: string;
    forearmLeft?: string;
    forearmRight?: string;
    thighLeft?: string;
    thighRight?: string;
    quadLeft?: string;
    quadRight?: string;
    calfLeft?: string;
    calfRight?: string;

    photoUri?: string;
}
