export type Diagnosis = {
  _id?: string;
  carId: string;
  fault: string;
  notes: string;
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
  stage: 'preliminary' | 'final';
  scores: {
    accuracy: number;
    clarity: number;
    usefulness: number;
    toolsCoverage: number;
    symptomMatch: number;
  };
  comment: string;
  createdAt: Date;
  diagnosis?: Diagnosis;
};
