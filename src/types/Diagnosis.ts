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
    }[];
    fixSteps: {
      title: string;
      procedure: string;
      tools: string;
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
  };
  mechanic?: {
    name: string;
    avatar?: string;
  };
};
