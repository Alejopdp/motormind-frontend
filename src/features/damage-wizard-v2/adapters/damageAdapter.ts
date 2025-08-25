/**
 * Adaptador para transformar datos de daños del backend al formato del frontend
 */

import { Damage, Severity } from '../types';
import { BackendDamage, BackendCar, BackendWorkflow, BackendTchekAggregate } from '../types/backend.types';
import { damageTypeMap } from '@/types/shared/damage.types';

// Mapeo de severidades del backend al frontend
const severityMap: Record<string, Severity> = {
  'SEV1': 'leve',
  'SEV2': 'leve',
  'SEV3': 'medio',
  'SEV4': 'grave',
  'SEV5': 'grave',
};

// ✅ NUEVO: Mapeo de nombres de partes de Tchek a GT Motive
const partNameMap: Record<string, string> = {
  // Aletas
  'AILE Arrière Gauche': 'Aleta tr iz',
  'AILE Arrière Droite': 'Aleta tr dr',
  'AILE Avant Gauche': 'Aleta dl iz',
  'AILE Avant Droite': 'Aleta dl dr',

  // Parachoques
  'PARE-CHOC Arrière': 'Paragolpes tr',
  'PARE-CHOC Avant': 'Paragolpes dl',

  // Puertas
  'PORTE Avant Gauche': 'Puerta dl iz',
  'PORTE Avant Droite': 'Puerta dl dr',
  'PORTE Arrière Gauche': 'Puerta tr iz',
  'PORTE Arrière Droite': 'Puerta tr dr',

  // Ruedas
  'ROUE Avant Gauche': 'Rueda dl iz',
  'ROUE Avant Droite': 'Rueda dl dr',
  'ROUE Arrière Gauche': 'Rueda tr iz',
  'ROUE Arrière Droite': 'Rueda tr dr',

  // Faros
  'PHARE Avant Gauche': 'Faro iz',
  'PHARE Avant Droite': 'Faro dr',

  // Retrovisores
  'RÉTROVISEUR Gauche': 'Retrovisor iz',
  'RÉTROVISEUR Droite': 'Retrovisor dr',

  // Fallbacks genéricos
  'Parte BD C izquierdo': 'Pilar C iz',
  'Parte BD C derecho': 'Pilar C dr',

  // Otros componentes
  'ENJOLIVEUR Avant Gauche': 'Enjoliveur dl iz',
  'ENJOLIVEUR Avant Droite': 'Enjoliveur dl dr',
  'ENJOLIVEUR Arrière Gauche': 'Enjoliveur tr iz',
  'ENJOLIVEUR Arrière Droite': 'Enjoliveur tr dr',

  // Manillas
  'POIGNÉE Avant Gauche': 'Manilla ext puerta dl iz',
  'POIGNÉE Avant Droite': 'Manilla ext puerta dl dr',
  'POIGNÉE Arrière Gauche': 'Manilla ext puerta tr iz',
  'POIGNÉE Arrière Droite': 'Manilla ext puerta tr dr',

  // Sensores
  'CAPTEUR DE PARKING Avant Gauche': 'Sensor aparcamiento dl iz',
  'CAPTEUR DE PARKING Avant Droite': 'Sensor aparcamiento dl dr',
  'CAPTEUR DE PARKING Arrière Gauche': 'Sensor aparcamiento tr iz',
  'CAPTEUR DE PARKING Arrière Droite': 'Sensor aparcamiento tr dr',
};


// Respuesta completa del endpoint de damages
export interface BackendDamagesResponse {
  detectedDamages: BackendDamage[];
  images: string[];
  car: BackendCar;
  workflow: BackendWorkflow;
  tchekAggregates?: BackendTchekAggregate[];
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

  // ✅ NUEVO: Mapear nombre de parte usando GT Motive
  const zone = partNameMap[backendDamage.area] || backendDamage.area;
  const subzone = backendDamage.subarea ? partNameMap[backendDamage.subarea] || backendDamage.subarea : undefined;

  // ✅ EXPANDIDO: Mapear tipo de daño
  const type = damageTypeMap[backendDamage.type] || backendDamage.type;

  // ✅ NUEVO: Usar evidencia de foto específica si existe
  const primaryEvidence = backendDamage.evidences?.[0];
  const imageUrl = primaryEvidence?.originalUrl || images[index % images.length] || images[0] || '';

  // ✅ NUEVO: Usar confidence real del backend (Tchek) en lugar del mock
  const confidence = backendDamage.confidence || getConfidenceFromSeverity(backendDamage.severity);

  return {
    id,
    zone,        // ← Nombre mapeado usando GT Motive
    subzone,     // ← Subzona mapeada usando GT Motive
    type,        // ← Tipo mapeado en español
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
