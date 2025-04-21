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
  diagnosis: string;
  wasUseful?: boolean;
  createdAt: Date;
  updatedAt: Date;
  car?: {
    _id: string;
    model: string;
    brand: string;
    plate: string;
    vinCode: string;
    mechanicId: string;
    kilometers: number;
    fuel: string;
    lastRevision: Date;
  };
  mechanic?: {
    name: string;
    avatar?: string;
  };
};
