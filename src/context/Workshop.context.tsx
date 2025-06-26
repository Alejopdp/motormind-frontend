import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useAuth } from './Auth.context';
import { useApi } from '@/hooks/useApi';
import { Workshop } from '@/types/Workshop';

interface WorkshopContextType {
  workshop: Workshop | null;
  isLoading: boolean;
  error: string | null;
  updateWorkshop: (updates: Partial<Workshop>) => Promise<void>;
  refreshWorkshop: () => Promise<void>;
}

const WorkshopContext = createContext<WorkshopContextType>({
  workshop: null,
  isLoading: false,
  error: null,
  updateWorkshop: async () => {},
  refreshWorkshop: async () => {},
});

export const useWorkshop = () => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopContextProvider');
  }
  return context;
};

export const WorkshopContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { execute: getWorkshop } = useApi<Workshop>('get', `/workshops/${user.workshopId}`);
  const { execute: updateWorkshopRequest } = useApi<Workshop>('put', `/workshops/:workshopId`);

  // Función para obtener los datos del workshop
  const fetchWorkshop = async () => {
    if (!isAuthenticated || !user.workshopId) {
      setWorkshop(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getWorkshop();
      if (response.data) {
        setWorkshop(response.data);
      }
    } catch (err) {
      setError('Error al cargar los datos del taller');
      console.error('Error fetching workshop:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar el workshop
  const updateWorkshop = async (updates: Partial<Workshop>) => {
    if (!workshop || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await updateWorkshopRequest(updates, undefined, {
        workshopId: user.workshopId,
      });

      if (response.data) {
        setWorkshop(response.data);
      }
    } catch (err) {
      setError('Error al actualizar el taller');
      console.error('Error updating workshop:', err);
      throw err; // Re-throw para que el componente pueda manejarlo
    } finally {
      setIsLoading(false);
    }
  };

  // Función para refrescar manualmente los datos
  const refreshWorkshop = async () => {
    await fetchWorkshop();
  };

  // Efecto para cargar datos cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user.workshopId) {
      fetchWorkshop();
    } else {
      setWorkshop(null);
      setError(null);
    }
  }, [isAuthenticated, user.workshopId]);

  // Limpiar estado cuando el usuario se desautentica
  useEffect(() => {
    if (!isAuthenticated) {
      setWorkshop(null);
      setError(null);
    }
  }, [isAuthenticated]);

  return (
    <WorkshopContext.Provider
      value={{
        workshop,
        isLoading,
        error,
        updateWorkshop,
        refreshWorkshop,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};
