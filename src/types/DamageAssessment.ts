import { Car } from './Car';

export interface DamageAssessment {
    _id: string;
    carId: string;
    car?: Car;
    description: string;
    images: string[];
    repairTimes?: string;
    prices?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
} 