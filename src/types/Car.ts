export type Car = {
  _id: string;
  vinCode: string;
  brand: string;
  model: string;
  year: number;
  mechanicId: string;
  plate: string;
  data: Record<string, any>;
};

export type CreateCar = {
  vinCode?: string;
  brand?: string;
  model?: string;
  year?: number;
  plate?: string;
  data?: Record<string, any>;
};
