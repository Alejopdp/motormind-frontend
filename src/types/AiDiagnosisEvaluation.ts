export type AiDiagnosisEvaluation = {
  _id: string;
  diagnosisId: string;
  carId: string;
  phase: 'RECEPTION' | 'PRELIMINARY_DIAGNOSIS' | 'FINAL_REPORT';
  evaluatorModel: string;
  evaluatedModel?: string;
  scores: {
    scoreStrictFormat: number;
    scoreClarityProfessionalism: number;
    scoreAntiHallucinationPrecision: number;

    scoreQuestionRelevance?: number | null;
    scoreQuestionPrioritization?: number | null;
    scoreQuestionCount?: number | null;

    scoreHypothesisAccuracy?: number | null;
    scoreReasoningQuality?: number | null;
    scoreVerificationStepsQuality?: number | null;

    scoreRepairPlan?: number | null;
    scorePartsList?: number | null;
    scoreBudget?: number | null;
    scoreAlternativeFailuresConclusion?: number | null;

    scoreGlobalAverage: number;
  };
  comment: string;
  detailedEvaluation: {
    strengths: string[];
    weaknesses: string[];
    scoreJustification: string;
    improvementSuggestions: string[];
    criticalErrorsDetected: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  diagnosis?: object;
  car?: object;
};
