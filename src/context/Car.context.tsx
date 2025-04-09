// Create a context for the car

import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { Car } from '@/types/Car';
import { Diagnosis } from '@/types/Diagnosis';
interface CarContextType {
  car: Car | null;
  setCar: (car: Car | null) => void;
  isLoadingCar: boolean;
  diagnoses: Diagnosis[];
  isLoadingDiagnoses: boolean;
  setDiagnoses: (diagnoses: Diagnosis[]) => void;
}

const CarContext = createContext<CarContextType>({
  car: null,
  setCar: () => {},
  isLoadingCar: true,
  diagnoses: [],
  isLoadingDiagnoses: true,
  setDiagnoses: () => {},
});

export const CarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoadingCar, setIsLoadingCar] = useState(true);
  const [isLoadingDiagnoses, setIsLoadingDiagnoses] = useState(true);
  const { execute: getCarById } = useApi<Car>('get', '/car/:carId');
  const { execute: getDiagnosesByCarId } = useApi<Diagnosis[]>('get', '/car/:carId/diagnosis');
  const params = useParams();

  useEffect(() => {
    if (params.carId === car?._id || !params.carId) return;

    const fectchCarById = async () => {
      const res = await getCarById(undefined, undefined, {
        carId: params.carId as string,
      });
      if (res.status === 200) {
        setCar(res.data);
        setIsLoadingCar(false);
      }
    };

    fectchCarById();
  }, [params.carId]);

  useEffect(() => {
    if (car) setIsLoadingCar(false);

    const fetchDiagnosesByCarId = async () => {
      setIsLoadingDiagnoses(true);
      const res = await getDiagnosesByCarId(undefined, undefined, {
        carId: car?._id as string,
      });
      if (res.status === 200) {
        setDiagnoses(res.data);
      }

      setIsLoadingDiagnoses(false);
    };
    if (car?._id) fetchDiagnosesByCarId();
  }, [car]);

  return (
    <CarContext.Provider
      value={{
        car,
        setCar,
        diagnoses,
        isLoadingCar,
        isLoadingDiagnoses,
        setDiagnoses,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCar = () => useContext(CarContext);
