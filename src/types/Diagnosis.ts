export type Diagnosis = {
  _id?: string;
  carId: string;
  fault: string;
  notes: string;
  answers: string;
  processedAnswers: string;
  questions: string[];
  status: string;
  processedFault: {
    symptomCleaned: string;
    category: string;
    potentialObdCodes: string[];
    notes: string;
  };
  preliminary: {
    moreReasonsRequestsQuantity: number;
    possibleReasons: {
      _id: string;
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
      partsDiagrams: DocumentLink[];
      laborHours: number;
    };
    confirmedFailures: [
      {
        title: string;
        steps: string[];
        tools: string[];
        resources: DocumentLink[];
        repairManuals: DocumentLink[];
      },
    ];
    alternativeFailures: [
      {
        title: string;
        probability: string;
        tests: string[];
        resources: DocumentLink[];
      },
    ];
  };
  wasUseful?: boolean;
  createdAt: Date;
  updatedAt: Date;
  rating?: {
    _id: string;
    notes: string;
    scoreStrictFormat: number;
  };
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
  markedAsRepairedBy?: string;
};

export type DocumentLink = {
  label: string;
  url: string;
};
