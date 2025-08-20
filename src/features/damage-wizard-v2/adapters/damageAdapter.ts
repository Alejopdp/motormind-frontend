/**
 * Adaptador para transformar datos de daños del backend al formato del frontend
 */

import { Damage, Severity } from '../types';
import { BackendDamage } from '../types/backend.types';

// Mapeo de severidades del backend al frontend
const severityMap: Record<string, Severity> = {
  'SEV1': 'leve',
  'SEV2': 'leve',
  'SEV3': 'medio',
  'SEV4': 'grave',
  'SEV5': 'grave',
};

// Mapeo de tipos de daño a descripciones en español
const damageTypeMap: Record<string, string> = {
  'dent': 'Abolladura',
  'scratch': 'Rayón',
  'broken': 'Rotura',
  'dislocated': 'Desplazamiento',
  'crack': 'Grieta',
  'hole': 'Agujero',
  'burn': 'Quemadura',
  'corrosion': 'Corrosión',
};

// Respuesta completa del endpoint de damages
export interface BackendDamagesResponse {
  detectedDamages: BackendDamage[];
  images: string[];
  car: any;
  workflow: any;
  tchekAggregates?: any[];
}

/**
 * Transforma un daño del backend al formato del frontend
 */
export function adaptBackendDamage(
  backendDamage: BackendDamage,
  index: number,
  images: string[]
): Damage & { __originalIndex: number; __originalData: BackendDamage } {
  // Generar un ID único basado en los datos del daño
  const id = `damage_${index}_${backendDamage.area}_${backendDamage.subarea}_${backendDamage.type}`.toLowerCase();

  // Mapear severidad
  const severity = severityMap[backendDamage.severity] || 'medio';

  // Mapear tipo de daño
  const type = damageTypeMap[backendDamage.type] || backendDamage.type;

  // ✅ NUEVO: Usar evidencia de foto específica si existe
  const primaryEvidence = backendDamage.evidences?.[0];
  const imageUrl = primaryEvidence?.originalUrl || images[index % images.length] || images[0] || '';

  // Calcular confidence basado en la severidad (mock para ahora)
  const confidence = getConfidenceFromSeverity(backendDamage.severity);

  return {
    id,
    zone: backendDamage.area,
    subzone: backendDamage.subarea,
    type,
    severity,
    confidence,
    imageUrl,
    status: 'pending',
    // ✅ NUEVO: preservar evidencias para ROI overlay
    evidences: backendDamage.evidences || [],
    // Metadatos para mapeo reverso
    __originalIndex: index,
    __originalData: backendDamage
  };
}

/**
 * Transforma la respuesta completa del backend
 */
export function adaptBackendDamagesResponse(
  response: BackendDamagesResponse
): (Damage & { __originalIndex: number; __originalData: BackendDamage })[] {
  const { detectedDamages, images } = response;

  if (!detectedDamages || detectedDamages.length === 0) {
    return [];
  }

  return detectedDamages.map((damage, index) =>
    adaptBackendDamage(damage, index, images)
  );
}

/**
 * Calcula un valor de confidence mock basado en la severidad
 */
function getConfidenceFromSeverity(severity: string): number {
  switch (severity) {
    case 'SEV1': return 95;
    case 'SEV2': return 90;
    case 'SEV3': return 85;
    case 'SEV4': return 80;
    case 'SEV5': return 75;
    default: return 85;
  }
}

/**
 * Mapea los IDs de daños del frontend a índices del backend
 */
export function mapSelectedDamageIdsToIndices(
  selectedIds: string[],
  adaptedDamages: (Damage & { __originalIndex: number; __originalData: BackendDamage })[]
): number[] {
  return selectedIds.map(id => {
    const adaptedDamage = adaptedDamages.find(d => d.id === id);
    return adaptedDamage?.__originalIndex;
  }).filter(index => index !== undefined) as number[];
}

/**
 * Mapea los IDs de daños del frontend a datos originales del backend
 */
export function mapSelectedDamagesToBackendData(
  selectedIds: string[],
  adaptedDamages: (Damage & { __originalIndex: number; __originalData: BackendDamage })[]
): BackendDamage[] {
  return selectedIds.map(id => {
    const adaptedDamage = adaptedDamages.find(d => d.id === id);
    return adaptedDamage?.__originalData;
  }).filter(Boolean) as BackendDamage[];
}
