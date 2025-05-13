export interface DiagnosisMetrics {
    timeToPreliminary: number;
    timeToFinal: number;
    averageTimeToFinal: number;
    averageTimeToRepaired: number;
    totalDiagnoses: number;
    completedDiagnoses: number;
    repairedDiagnoses: number;
    timeSavedInHours: number;
    modelQuality: {
        averageScoreByPhase: {
            preliminary: number;
            final: number;
        };
        obdCodePercentage: number;
        videoRecommendationPercentage: number;
    };
}