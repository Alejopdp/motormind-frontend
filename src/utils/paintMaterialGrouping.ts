import { PaintMaterialType, PAINT_MATERIAL_LABELS, PAINT_MATERIAL_CODES } from '@/types/PaintMaterial';
import { Damage, PaintWork } from '@/types/DamageAssessment';

export interface GroupedPaintMaterial {
    type: PaintMaterialType;
    code: string;
    description: string;
    totalQuantity: number;
    averagePrice: number; // Precio promedio ponderado
    totalAmount: number;
    items: PaintWork[]; // Items originales para referencia
}

/**
 * Agrupa materiales de pintura por tipo, calculando cantidades totales y precios promedio ponderados
 */
export const groupPaintMaterials = (damages: Damage[]): GroupedPaintMaterial[] => {
    // DEBUG: Logs para entender qué está pasando
    console.log('=== DEBUG PAINT MATERIAL GROUPING ===');
    console.log('Total damages received:', damages.length);
    console.log('Damages with paintWorks:', damages.filter(d => d.paintWorks && d.paintWorks.length > 0).length);

    damages.forEach((damage, index) => {
        console.log(`Damage ${index}:`, {
            description: damage.description,
            hasPaintWorks: !!(damage.paintWorks && damage.paintWorks.length > 0),
            paintWorks: damage.paintWorks?.map(pw => ({
                type: pw.type,
                description: pw.description,
                quantity: pw.quantity,
                price: pw.price
            })) || []
        });
    });

    // Extraer todos los paintWorks de los daños
    const allPaintWorks = damages.flatMap(damage =>
        (damage.paintWorks || []).filter(paintWork => paintWork.type && paintWork.description)
    );

    console.log('Total paintWorks found:', allPaintWorks.length);
    console.log('PaintWorks data:', allPaintWorks);

    if (allPaintWorks.length === 0) {
        console.log('No paintWorks found, returning empty array');
        return [];
    }

    // Agrupar por tipo
    const groupedByType = allPaintWorks.reduce((groups, paintWork) => {
        const type = paintWork.type;
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(paintWork);
        return groups;
    }, {} as Record<PaintMaterialType, PaintWork[]>);

    // Convertir a array de GroupedPaintMaterial
    const groupedMaterials: GroupedPaintMaterial[] = Object.entries(groupedByType).map(([type, items]) => {
        const materialType = type as PaintMaterialType;

        // Calcular totales
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        // Precio promedio ponderado
        const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;

        // Importe total (convertir de ml a litros para el cálculo final)
        const totalAmount = totalCost / 1000;

        return {
            type: materialType,
            code: PAINT_MATERIAL_CODES[materialType],
            description: PAINT_MATERIAL_LABELS[materialType],
            totalQuantity,
            averagePrice,
            totalAmount,
            items,
        };
    });

    // Ordenar por tipo para consistencia
    const typeOrder = [
        PaintMaterialType.FILLER,
        PaintMaterialType.PRIMER,
        PaintMaterialType.PLASTIC_PRIMER,
        PaintMaterialType.ADHESION_PROMOTER,
        PaintMaterialType.BASE_PAINT,
        PaintMaterialType.CLEAR_COAT,
    ];

    return groupedMaterials.sort((a, b) => {
        const aIndex = typeOrder.indexOf(a.type);
        const bIndex = typeOrder.indexOf(b.type);
        return aIndex - bIndex;
    });
};

/**
 * Calcula el subtotal de todos los materiales de pintura agrupados
 */
export const calculatePaintMaterialsSubtotal = (groupedMaterials: GroupedPaintMaterial[]): number => {
    return groupedMaterials.reduce((total, material) => total + material.totalAmount, 0);
}; 