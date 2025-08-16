/**
 * Tipos específicos para las respuestas del backend del wizard v2
 * Estos tipos representan exactamente lo que viene del API, antes de ser adaptados
 * para consumo en el frontend.
 */

// ============================================================================
// RESPUESTAS DE ENDPOINTS
// ============================================================================

/**
 * Respuesta del endpoint POST /damage-assessments/intakes
 */
export interface BackendIntakeResponse {
  id: string;
  workflow: {
    status: 'processing' | 'detected' | 'error';
    history: Array<{
      status: string;
      at: string;  // ISO date string
    }>;
  } | null;
  tchekId?: string;
}

/**
 * Respuesta del endpoint GET /damage-assessments/:id/damages
 */
export interface BackendDamagesResponse {
  detectedDamages: BackendDetectedDamage[];
  tchekAggregates: Record<string, unknown> | Array<unknown>;
  images: string[];
  car: BackendCar | null;
  workflow: BackendWorkflow | null;
}

/**
 * Respuesta del endpoint PATCH /damage-assessments/:id/damages/confirm
 */
export interface BackendConfirmDamagesResponse {
  success: boolean;
  confirmedDamageIds: string[];
  message?: string;
}

/**
 * Respuesta del endpoint POST /damage-assessments/:id/operations/generate
 */
export interface BackendOperationsResponse {
  operations: BackendOperation[];
  metadata?: {
    hasNoDataLabor?: boolean;
    usedFallbacks?: string[];
  };
}

/**
 * Respuesta del endpoint POST /damage-assessments/:id/valuation/generate
 */
export interface BackendValuationResponse {
  valuation: BackendValuation;
  metadata?: {
    calculations: {
      laborWithoutPaint: number;
      paintLabor: number;
      paintMaterials: number;
      spareParts: number;
    };
    currency: string;
  };
}

/**
 * Respuesta del endpoint PATCH /damage-assessments/:id/finalize
 */
export interface BackendFinalizeResponse {
  success: boolean;
  finalizedAt: string;  // ISO date string
  assessmentId: string;
}

// ============================================================================
// ENTIDADES DEL BACKEND
// ============================================================================

/**
 * Daño detectado tal como lo devuelve Tchek/backend
 */
export interface BackendDetectedDamage {
  _id: string;
  area: string;         // Zona del vehículo
  subarea?: string;     // Sub-zona específica
  type: string;         // Tipo de daño (scratch, dent, etc.)
  severity: 'SEV1' | 'SEV2' | 'SEV3';  // Severidad en formato backend
  confidence: number;   // 0-100
  notes?: string;
  
  // Metadatos de Tchek
  tchekData?: {
    boxId?: string;
    coordinates?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    imageUrl?: string;
  };
  
  // Campos adicionales que puede tener el backend
  dimensions?: {
    length?: number;
    width?: number;
    depth?: number;
    surface?: number;
  };
}

/**
 * Operación tal como la devuelve el backend
 */
export interface BackendOperation {
  mappingId: string;
  partName: string;
  
  mainOperation?: {
    operation: 'REPAIR' | 'REPLACE' | 'PAINT' | 'POLISH';
    description?: string;
    code?: string;
    complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  };
  
  subOperations?: Array<{
    operation: string;
    description?: string;
    code?: string;
    complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  }>;
  
  paint?: {
    apply?: boolean;
    paintType?: 'MONOCOAT' | 'BICOAT' | 'TRICOAT';
    finishType?: 'NEW_PART' | 'REPAIRED_PART';
  };
  
  // Metadatos
  source?: 'autodata' | 'manual' | 'calculated';
  estimatedHours?: number;
}

/**
 * Valoración completa del backend
 */
export interface BackendValuation {
  labor: BackendLaborOperation[];
  paint: BackendPaintOperation[];
  parts?: BackendSparePart[];
  totals: BackendValuationTotals;
}

/**
 * Operación de mano de obra (sin pintura)
 */
export interface BackendLaborOperation {
  mappingId: string;
  partName: string;
  operation: string;
  hours: number;
  rate: number;    // €/hour
  total: number;
  source: 'autodata' | 'segment_lookup' | 'calc' | 'user_override' | 'no_data';
  isManuallyAdjusted?: boolean;
  originalHours?: number;  // Para tracking de cambios
}

/**
 * Operación de pintura (MO + materiales)
 */
export interface BackendPaintOperation {
  mappingId: string;
  partName: string;
  job: string;           // Descripción del trabajo
  
  // Mano de obra de pintura
  paintHours: number;
  paintLaborRate: number;
  paintLaborTotal: number;
  
  // Materiales
  units?: number;        // Unidades de pintura (ej: 0.5L)
  unitPrice?: number;    // €/unidad
  materialsTotal: number;
  
  // Total combinado
  total: number;
  
  // Metadatos
  paintType?: 'MONOCOAT' | 'BICOAT' | 'TRICOAT';
  complexity?: string;
}

/**
 * Recambio/pieza
 */
export interface BackendSparePart {
  ref: string;           // Referencia del recambio
  partName: string;
  unitPrice: number;
  qty: number;
  total: number;
  
  // Metadatos
  isOriginal?: boolean;
  supplier?: string;
  isManuallyAdjusted?: boolean;
}

/**
 * Totales de la valoración
 */
export interface BackendValuationTotals {
  labor: number;           // Total mano de obra sin pintura
  paintLabor: number;      // Total mano de obra de pintura
  paintMaterials: number;  // Total materiales de pintura
  parts: number;           // Total recambios
  grandTotal: number;      // Gran total
  currency: string;        // EUR, USD, etc.
  
  // Desglose adicional si está disponible
  tax?: number;            // IVA u otros impuestos
  taxRate?: number;        // Porcentaje de impuesto
}

/**
 * Información del vehículo
 */
export interface BackendCar {
  _id: string;
  vinCode?: string;
  brand: string;
  model: string;
  year?: string;
  plate: string;
  
  // Campos adicionales que puede tener
  data?: Record<string, unknown>;
  kilometers?: number;
  fuel?: string;
}

/**
 * Estado del workflow del peritaje
 */
export interface BackendWorkflow {
  status: 'processing' | 'detected' | 'damages_confirmed' | 'operations_defined' | 'valuated' | 'completed' | 'error';
  history: Array<{
    status: string;
    at: string;  // ISO date string
    metadata?: Record<string, unknown>;
  }>;
  currentStep?: string;
  flags?: {
    usedMockTchek?: boolean;
    hasNoDataLabor?: boolean;
  };
}

// ============================================================================
// PAYLOADS PARA REQUESTS
// ============================================================================

/**
 * Payload para POST /damage-assessments/intakes
 */
export interface BackendIntakePayload {
  vehicleInfo?: {
    brand?: string;
    model?: string;
    year?: string;
    vinCode?: string;
    plate?: string;
  };
  images?: string[];
  description?: string;
  insuranceCompany?: string;
  claimNumber?: string;
}

/**
 * Payload para PATCH /damage-assessments/:id/damages/confirm
 */
export interface BackendConfirmDamagesPayload {
  confirmedDamageIds: string[];
  edits?: Array<{
    damageId: string;
    changes: Partial<BackendDetectedDamage>;
  }>;
}

/**
 * Payload para PATCH /damage-assessments/:id/operations
 */
export interface BackendOperationsPayload {
  operations: Array<{
    mappingId: string;
    changes: Partial<BackendOperation>;
  }>;
}

// ============================================================================
// UTILIDADES DE TIPO
// ============================================================================

/**
 * Helper para tipar respuestas de API que pueden fallar
 */
export type BackendResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  message?: string;
};

/**
 * Estados posibles del backend
 */
export type BackendStatus = BackendWorkflow['status'];

/**
 * Fuentes de datos posibles
 */
export type BackendDataSource = 'autodata' | 'segment_lookup' | 'calc' | 'user_override' | 'no_data' | 'manual';
