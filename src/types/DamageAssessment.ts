import { Car } from './Car';
import { DocumentLink } from './Diagnosis';
import { PaintMaterialType } from './PaintMaterial';
import { DamageSeverity, DamageType, DamageAction } from './shared/damage.types';

// ✅ CENTRALIZADO: Re-exportar enums desde tipos compartidos
export { DamageSeverity, DamageType, DamageAction };

export interface SparePart {
    description: string;
    reference: string;
    quantity: number;
    price: number;
}

export interface AdditionalAction {
    description: string;
    time: number; // in minutes
    hourlyRate: number; // hourly rate in euros
}

export interface PaintWork {
    type: PaintMaterialType;
    description: string;
    quantity: number;
    price: number;
}

export interface Damage {
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

export interface DamageAssessment {
    _id: string;
    carId: string;
    car?: Car;
    description: string;
    images: string[];
    repairTimes?: string;
    prices?: string;
    createdBy: string;
    damages: Damage[];
    workshopId: string;
    createdAt: string;
    updatedAt: string;
    state: 'PENDING_REVIEW' | 'DAMAGES_CONFIRMED';
    notes?: string;
    insuranceCompany: string;
    claimNumber?: string;
} 