import { Car } from './Car';

export interface Damage {
    description: string;
    area: string;
    type: string;
    severity: string;
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