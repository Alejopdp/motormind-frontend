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
    area: string;
    subarea: string;
    description: string;
    type: DamageType;
    severity: DamageSeverity;
    resources: DocumentLink[];
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
    createdAt: string;
    updatedAt: string;
} 