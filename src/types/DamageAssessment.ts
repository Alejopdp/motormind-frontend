import { Car } from './Car';
import { DocumentLink } from './Diagnosis';

export enum DamageSeverity {
    SEV1 = 'SEV1',
    SEV2 = 'SEV2',
    SEV3 = 'SEV3',
    SEV4 = 'SEV4',
    SEV5 = 'SEV5',
}

export enum DamageAction {
    POLISH = 'POLISH',
    RENOVATE = 'RENOVATE',
    QUICK_REPAIR = 'QUICK_REPAIR',
    PAINT = 'PAINT',
    REPAIR_AND_PAINT = 'REPAIR_AND_PAINT',
    REPLACE = 'REPLACE',
}

export enum DamageType {
    SCRATCH = 'scratch',
    DENT = 'dent',
}

export interface SparePart {
    description: string;
    reference: string;
    quantity: number;
    price: number;
}

export interface AdditionalAction {
    description: string;
    time: number; // in minutes
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
} 