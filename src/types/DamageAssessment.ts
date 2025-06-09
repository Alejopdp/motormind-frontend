import { Car } from './Car';
import { DocumentLink } from './Diagnosis';

export enum DamageType {
    SCRATCH = 'scratch',
    DENT = 'dent',
}

export enum DamageSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export interface Damage {
    _id?: string;
    area: string;
    subarea: string;
    description: string;
    type: DamageType;
    severity: DamageSeverity;
    resources: DocumentLink[];
    isConfirmed: boolean | null;
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