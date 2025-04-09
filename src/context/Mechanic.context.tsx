import { AxiosResponse } from 'axios';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from './Auth.context';

interface MechanicContextType {
  pricePerHour: number;
  updatePricePerHour: (pricePerHour: number) => Promise<
    AxiosResponse<{
      pricePerHour: number;
    }>
  >;
}

export const MechanicContext = createContext<MechanicContextType>({
  pricePerHour: 0,
  updatePricePerHour: () =>
    Promise.resolve({
      data: null,
      error: null,
      loading: false,
    } as unknown as AxiosResponse<{ pricePerHour: number }>),
});

export const useMechanic = () => useContext(MechanicContext);

export const MechanicProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [pricePerHour, setPricePerHour] = useState(0);
  const { user } = useAuth();
  const { execute: getPricePerHour } = useApi<{ pricePerHour: number }>(
    'get',
    `/mechanic/${user.mechanicId}`,
  );
  const { execute: updatePricePerHourRequest } = useApi<{
    pricePerHour: number;
  }>('put', `/mechanic/${user.mechanicId}`);

  useEffect(() => {
    getPricePerHour().then((res) => {
      setPricePerHour(res.data.pricePerHour);
    });
  }, []);

  const updatePricePerHour = async (pricePerHour: number) => {
    const res = await updatePricePerHourRequest({ pricePerHour });
    if (res.status === 200) {
      setPricePerHour(res.data.pricePerHour);
    }
    return res;
  };

  return (
    <MechanicContext.Provider value={{ pricePerHour, updatePricePerHour }}>
      {children}
    </MechanicContext.Provider>
  );
};
