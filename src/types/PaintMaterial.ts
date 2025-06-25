export enum PaintMaterialType {
    PRIMER = 'PRIMER',
    PLASTIC_PRIMER = 'PLASTIC_PRIMER',
    BASE_PAINT = 'BASE_PAINT',
    CLEAR_COAT = 'CLEAR_COAT',
    FILLER = 'FILLER',
    ADHESION_PROMOTER = 'ADHESION_PROMOTER',
}

export interface PaintWork {
    type: PaintMaterialType;
    description: string;
    quantity: number;
    price: number;
}

// Mapeo de tipos a nombres legibles en español
export const PAINT_MATERIAL_LABELS: Record<PaintMaterialType, string> = {
    [PaintMaterialType.PRIMER]: 'Imprimación',
    [PaintMaterialType.PLASTIC_PRIMER]: 'Imprimación para Plásticos',
    [PaintMaterialType.BASE_PAINT]: 'Pintura Base',
    [PaintMaterialType.CLEAR_COAT]: 'Barniz Transparente',
    [PaintMaterialType.FILLER]: 'Masilla',
    [PaintMaterialType.ADHESION_PROMOTER]: 'Promotor de Adherencia',
};

// Códigos para el reporte (similar al sistema actual de talleres)
export const PAINT_MATERIAL_CODES: Record<PaintMaterialType, string> = {
    [PaintMaterialType.PRIMER]: 'PRIM',
    [PaintMaterialType.PLASTIC_PRIMER]: 'PPRIM',
    [PaintMaterialType.BASE_PAINT]: 'BASE',
    [PaintMaterialType.CLEAR_COAT]: 'BARN',
    [PaintMaterialType.FILLER]: 'MAS',
    [PaintMaterialType.ADHESION_PROMOTER]: 'ADHE',
}; 