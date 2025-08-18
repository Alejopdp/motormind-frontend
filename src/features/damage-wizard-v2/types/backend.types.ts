/**
 * Tipos del backend para el frontend
 * Mantenemos paridad con los tipos del backend para consistencia
 */

// Enums del backend
export enum DamageSeverity {
  SEV1 = 'SEV1',
  SEV2 = 'SEV2',
  SEV3 = 'SEV3',
  SEV4 = 'SEV4',
  SEV5 = 'SEV5',
}

export enum DamageType {
  SCRATCH = 'scratch',
  DENT = 'dent',
  CRACK = 'crack',
  BREAK = 'break',
}

export enum DamageAction {
  REPLACE = 'REPLACE',
  REPAIR = 'REPAIR',
  DISASSEMBLE_AND_ASSEMBLE = 'DISASSEMBLE_AND_ASSEMBLE',
  PAINT = 'PAINT',
  ANTI_CORROSION_TREATMENT = 'ANTI_CORROSION_TREATMENT',
  VERIFY = 'VERIFY',
  ADJUST = 'ADJUST',
  DISASSEMBLE_OR_DISMANTLE = 'DISASSEMBLE_OR_DISMANTLE',
  POLISH = 'POLISH',
  REPAIR_BY_HAIL_FORMULA = 'REPAIR_BY_HAIL_FORMULA',
  RENOVATE = 'RENOVATE',
  QUICK_REPAIR = 'QUICK_REPAIR',
  REPAIR_AND_PAINT = 'REPAIR_AND_PAINT',
}

export enum PaintMaterialType {
  PRIMER = 'PRIMER',
  PLASTIC_PRIMER = 'PLASTIC_PRIMER',
  BASE_PAINT = 'BASE_PAINT',
  CLEAR_COAT = 'CLEAR_COAT',
  FILLER = 'FILLER',
  ADHESION_PROMOTER = 'ADHESION_PROMOTER',
}

// Interfaces del backend
export interface DocumentLink {
  label: string;
  url: string;
}

export interface SparePart {
  description: string;
  reference: string;
  quantity: number;
  price: number;
}

export interface AdditionalAction {
  description: string;
  time: number; // in minutes
  hourlyRate: number;
}

export interface PaintWork {
  type: PaintMaterialType;
  description: string;
  quantity: number;
  price: number;
}

export interface BackendDamage {
  _id?: string;
  area: string;
  subarea?: string;
  description: string;
  type: DamageType;
  severity: DamageSeverity;
  resources: DocumentLink[];
  isConfirmed: boolean | null;
  action?: DamageAction;
  spareParts?: SparePart[];
  additionalActions?: AdditionalAction[];
  paintWorks?: PaintWork[];
  notes?: string;
}

export interface BackendCar {
  _id: string;
  vinCode: string;
  brand: string;
  model: string;
  year: string;
  data: Record<string, unknown>;
  kilometers: number;
  fuel: string;
  lastRevision: string;
  plate: string;
  workshopId: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BackendWorkflow {
  status: 'processing' | 'detected' | 'damages_confirmed' | 'operations_defined' | 'valuated' | 'completed' | 'error';
  history?: Array<{
    status: string;
    at: string | Date;
    note?: string;
    _id?: string;
  }>;
}

export interface BackendTchekAggregate {
  gtMotivePartName: string;
  fraction_total: number;
  surface_m2_total: number;
  roi_counts_by_type: Record<string, number>;
  max_scratch_length_dm?: number;
  max_dent_diameter_dm?: number;
}

// Tipos para los campos staged-flow que usan any en el backend
export interface BackendTchekMeta {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

export interface BackendTchekReport {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

export interface BackendGtMotiveMapping {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

export interface BackendOperationEdited {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

export interface BackendLaborOutput {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

export interface BackendPart {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

export interface BackendPaintWork {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

export interface BackendCompact {
  // TODO: Definir estructura específica cuando se conozca
  [key: string]: unknown;
}

// Interface principal del DamageAssessment del backend
export interface BackendDamageAssessment {
  _id?: string;
  carId: string;
  car?: BackendCar;
  description: string;
  images: string[];
  repairTimes?: string;
  prices?: string;
  workshopId: string;
  createdBy: string;
  damages: BackendDamage[];
  createdAt: Date | string;
  updatedAt: Date | string;
  state: 'PENDING_REVIEW' | 'DAMAGES_CONFIRMED';
  notes?: string;
  insuranceCompany: string;
  claimNumber?: string;
  
  // New staged flow fields
  workflow?: BackendWorkflow;
  tchekId?: string;
  tchekMeta?: BackendTchekMeta;
  tchekReport?: BackendTchekReport;
  tchekAggregates?: BackendTchekAggregate[];
  detectedDamages?: BackendDamage[];
  confirmedDamages?: BackendDamage[];
  gtMotiveMappings?: BackendGtMotiveMapping[];
  operationsEdited?: BackendOperationEdited[];
  laborOutput?: BackendLaborOutput[];
  parts?: BackendPart[];
  paintWorks?: BackendPaintWork[];
  compact?: BackendCompact;
}

// Respuesta del endpoint GET /damage-assessments/:id/damages
export interface BackendDamagesResponse {
  detectedDamages: BackendDamage[];
  tchekAggregates: BackendTchekAggregate[];
  images: string[];
  car: BackendCar | null;
  workflow: BackendWorkflow | null;
}
