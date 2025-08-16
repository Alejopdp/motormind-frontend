export type Severity = 'leve' | 'medio' | 'grave';

export type DamageStatus = 'pending' | 'confirmed' | 'rejected';

export type OperationKind = 'PULIR' | 'REPARAR' | 'PINTAR' | 'REPARAR_Y_PINTAR' | 'SUSTITUIR';

/**
 * Damage interface compatible con el repo de diseño
 * Para uso en DamageCard con paridad 1:1
 */
export interface Damage {
  id: string;
  zone: string;
  subzone?: string;
  type: string;
  severity: Severity;
  confidence: number; // 0-100
  imageUrl: string;
  status: DamageStatus;
}

export type DamageSource = 'autodata' | 'segment_lookup' | 'calc' | 'user_override' | 'no_data';

export type WizardStepKey = 
  | 'intake'
  | 'damages'
  | 'operations'
  | 'valuation'
  | 'finalize';

export type WizardStep = {
  key: WizardStepKey;
  title: string;
  subtitle?: string;
  status: 'inactive' | 'active' | 'complete';
};

export type MockDamage = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  severity: Severity;
  confidencePct?: number;
};

export type MockOperation = {
  id: string;
  partName: string;
  damageType: string;
  severity: Severity;
  operation: OperationKind;
};

export type MockValuationItem = {
  partName: string;
  operation: string;
  hours: number;
  rate: number;
  total: number;
  source: DamageSource;
};

export type MockPaintItem = {
  partName: string;
  job: string;
  paintHours: number;
  paintLaborTotal: number;
  units: number;
  unitPrice: number;
  materialsTotal: number;
  total: number;
};

export type MockPartItem = {
  ref: string;
  partName: string;
  unitPrice: number;
  qty: number;
  total: number;
};
