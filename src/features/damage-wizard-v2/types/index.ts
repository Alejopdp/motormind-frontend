export type Severity = 'leve' | 'medio' | 'grave';

export type DamageStatus = 'pending' | 'confirmed' | 'rejected';

export type OperationKind = 'PULIR' | 'REPARAR' | 'PINTAR' | 'REPARAR_Y_PINTAR' | 'SUSTITUIR';

// Nuevos tipos para el sistema de recomendación de operaciones
export type DamageAction = 'REPAIR' | 'REPLACE' | 'PAINT' | 'POLISH' | 'REPAIR_AND_PAINT';

export type OperationSource = 'autodata' | 'rule_engine' | 'no_data';

export interface ProposedMainOperation {
  operation: DamageAction;
  confidence: number;
  reason: string;
  source: OperationSource;
}

export interface ProposedSubOperation {
  operation: string;
  confidence: number;
  reason: string;
}

export interface ProposedOperation {
  main: ProposedMainOperation;
  subOperations: ProposedSubOperation[];
}

export interface EditedMainOperation {
  operation: DamageAction;
  reason: string;
}

export interface EditedSubOperation {
  operation: string;
  reason: string;
}

export interface EditedOperation {
  main: EditedMainOperation;
  subOperations: EditedSubOperation[];
}

export interface BackendOperation {
  mappingId: string;
  partName: string;
  partCode?: string;
  proposedOperation?: ProposedOperation;
  editedOperation?: EditedOperation;
  effectiveOperation: ProposedMainOperation | EditedMainOperation;
  hasUserOverride: boolean;
}

// Re-export tipos de evidencia del backend para uso en frontend
export type { DamageEvidence, DamagePictureROI } from './backend.types';

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
  evidences?: import('./backend.types').DamageEvidence[]; // ✅ NUEVO: evidencias de fotos con ROI
}

/**
 * Estadísticas para BatchActions component
 * Compatible con el repo de diseño
 */
export interface BatchActionStats {
  total: number;
  confirmed: number;
  rejected: number;
  pending: number;
}

/**
 * Operación de mano de obra (sin pintura)
 */
export interface LaborOperation {
  id: string;
  piece: string;
  operation: string;
  hours: number;
  rate: number; // €/hour
  total: number;
  source: 'autodata' | 'manual';
  isManuallyAdjusted?: boolean;
}

/**
 * Operación de pintura (mano de obra)
 */
export interface PaintOperation {
  id: string;
  piece: string;
  operation: string;
  hours: number;
  rate: number; // €/hour
  total: number;
}

/**
 * Material de pintura
 */
export interface PaintMaterial {
  id: string;
  piece: string;
  description: string;
  units: string; // e.g., "0.5L"
  pricePerUnit: number; // €/unit
  total: number;
}

/**
 * Recambio/Pieza
 */
export interface SparePart {
  id: string;
  piece: string;
  reference: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isManuallyAdjusted?: boolean;
}

/**
 * Resumen de totales para valoración
 */
export interface ValuationTotals {
  laborWithoutPaint: number;
  paintLabor: number;
  paintMaterials: number;
  spareParts: number;
  subtotal: number;
  tax: number; // IVA 21%
  total: number;
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

export type WizardV2Status =
  | 'idle'
  | 'processing'
  | 'detected'
  | 'damages_confirmed'
  | 'operations_defined'
  | 'valuated'
  | 'completed'
  | 'error';

export type WorkflowStatus = 'processing' | 'detected' | 'damages_confirmed' | 'operations_defined' | 'valuated' | 'completed' | 'error';

export interface FrontendOperation {
  id: string;
  partName: string;
  damageType: string;
  severity: 'leve' | 'medio' | 'grave';
  operation: OperationKind;
  originalDamage: any; // Referencia al daño original del backend
}
