export type Diagnosis = {
  _id?: string;
  carId: string;
  fault: string;
  notes: string;
  questions: string[];
  preliminary: {
    possibleReasons: {
      title: string;
      probability: string;
      reasonDetails: string;
      diagnosticRecommendations: string[];
      requiredTools: string[];
    }[];
  };
  finalNotes: string;
  diagnosis: {
    conclusion: {
      recommendations: string[];
      nextSteps: string[];
    };
    estimatedBudget: {
      parts: [
        {
          name: string;
          price: number;
          quality: string;
        },
      ];
      laborHours: number;
    };
    confirmedFailures: [
      {
        title: string;
        steps: string[];
        tools: string[];
        resources: {
          label: string;
          url: string;
        }[];
      },
    ];
    alternativeFailures: [
      {
        title: string;
        probability: string;
        tests: string[];
        resources: {
          label: string;
          url: string;
        }[];
      },
    ];
  };
  wasUseful?: boolean;
  createdAt: Date;
  updatedAt: Date;
  car?: {
    _id: string;
    model: string;
    brand: string;
    plate: string;
    vinCode: string;
    workshopId: string;
    kilometers: number;
    fuel: string;
    lastRevision: Date;
  };
  createdBy?: {
    name: string;
    avatar?: string;
  };
};

export type AiDiagnosisEvaluation = {
  _id: string;
  diagnosisId: string | { _id: string } | Diagnosis;
  carId: string | { _id: string };
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
  diagnosis?: Diagnosis;
};
