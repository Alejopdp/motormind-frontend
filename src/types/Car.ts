export type Car = {
  _id: string;
  vinCode: string;
  brand: string;
  model: string;
  year: number;
  mechanicId: string;
  plate: string;
  kilometers: number;
  fuel: string;
  lastRevision: string;
  data: Record<string, string>;
};

export type CreateCar = {
  vinCode?: string;
  brand?: string;
  model?: string;
  year?: number;
  plate?: string;
  kilometers?: number;
  fuel?: string;
  lastRevision?: Date;
};
