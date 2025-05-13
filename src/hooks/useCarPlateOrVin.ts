import { Car } from '@/types/Car';

export const useCarPlateOrVin = (car?: Car) => {
    if (!car) return '';

    return car.plate
        ? `Matricula: ${car.plate}`
        : `VIN: ${car.vinCode}`;
}; 