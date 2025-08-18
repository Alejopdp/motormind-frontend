/**
 * Utilidades para mapeo de daños entre frontend y backend
 */

export const mapFrontendIdsToBackendIds = (
  selectedDamages: string[],
  adaptedDamagesWithMeta: any[]
): string[] => {
  return selectedDamages
    .map((frontendId) => {
      const adaptedDamage = adaptedDamagesWithMeta.find((d) => d.id === frontendId);
      if (!adaptedDamage) {
        console.warn('⚠️ No se encontró daño adaptado para ID:', frontendId);
        return null;
      }
      // Usar el ID real del backend o generar uno basado en área-subárea
      const backendId =
        (adaptedDamage.__originalData as any)._id ||
        `${adaptedDamage.__originalData.area}-${adaptedDamage.__originalData.subarea}`;
      console.log(`🔄 Mapeando frontend ID "${frontendId}" → backend ID "${backendId}"`);
      return backendId;
    })
    .filter(Boolean) as string[];
};
