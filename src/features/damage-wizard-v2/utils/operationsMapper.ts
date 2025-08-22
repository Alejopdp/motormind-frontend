import { BackendDamage, DamageAction } from '../types/backend.types';
import { BackendOperation } from '../types';

// Re-export BackendOperation para usar directamente
export type { BackendOperation };

/**
 * Mapea los daños confirmados con sus operaciones correspondientes
 * desde gtMotiveMappings del assessment
 */
export const mapDamagesWithOperations = (
  confirmedDamages: BackendDamage[],
  gtMotiveMappings: any[] = []
): BackendOperation[] => {
  return confirmedDamages.map((damage) => {
    // Buscar el mapping correspondiente por área/subárea
    const mapping = gtMotiveMappings.find((mapping) => {
      const mappingPartName = mapping.partName?.toLowerCase() || '';
      const damageArea = damage.area?.toLowerCase() || '';
      const damageSubarea = damage.subarea?.toLowerCase() || '';
      
      return (
        mappingPartName.includes(damageArea) ||
        mappingPartName.includes(damageSubarea) ||
        damageArea.includes(mappingPartName) ||
        damageSubarea.includes(mappingPartName)
      );
    });

    // Si no hay mapping, crear uno por defecto
    if (!mapping) {
      return {
        mappingId: damage._id || `damage-${Date.now()}`,
        partName: damage.area + (damage.subarea ? ` - ${damage.subarea}` : ''),
        partCode: undefined,
        proposedOperation: undefined,
        editedOperation: undefined,
        effectiveOperation: {
          operation: damage.action || DamageAction.REPAIR,
          reason: 'default_assignment'
        },
        hasUserOverride: false
      };
    }

    // Usar el mapping existente
    return {
      mappingId: mapping.mappingId || mapping._id || `mapping-${Date.now()}`,
      partName: mapping.partName || damage.area,
      partCode: mapping.partCode,
      proposedOperation: mapping.proposedOperation,
      editedOperation: mapping.editedOperation,
      effectiveOperation: {
        operation: mapping.editedOperation?.main?.operation || 
                  mapping.proposedOperation?.main?.operation || 
                  damage.action || 
                  DamageAction.REPAIR,
        reason: mapping.editedOperation ? 'user_decision' : 'ai_recommendation'
      },
      hasUserOverride: !!mapping.editedOperation
    };
  });
};
