import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/Auth.context';

const ConfiguracionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [newPricePerHour, setNewPricePerHour] = useState<string>('');
  const { execute: updatePricePerHourRequest } = useApi<{ pricePerHour: number }>(
    'put',
    `/workshops/:workshopId`,
  );
  const { execute: getMechanicRequest } = useApi<{ pricePerHour: number }>(
    'get',
    `/workshops/${user.workshopId}`,
  );

  const { data: mechanicData, isLoading: isLoadingMechanic } = useQuery({
    queryKey: ['workshop', user.workshopId],
    queryFn: async () => {
      const response = await getMechanicRequest();
      const price = response.data?.pricePerHour || 0;
      setNewPricePerHour(price.toString());
      return response.data;
    },
    enabled: !!user.workshopId,
  });

  const { mutate: updatePricePerHourMutation, isPending: isSubmitting } = useMutation({
    mutationFn: async (price: number) => {
      const response = await updatePricePerHourRequest({ pricePerHour: price }, undefined, {
        workshopId: user.workshopId,
      });
      return response;
    },
    onSuccess: () => {
      enqueueSnackbar('Cambios guardados correctamente', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('No se pudieron guardar los cambios', {
        variant: 'error',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Si está vacío, permitir borrar
    if (value === '') {
      setNewPricePerHour('');
      return;
    }

    // Convertir a número y validar
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setNewPricePerHour(numValue.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numValue = parseInt(newPricePerHour, 10);
    if (numValue > 0) {
      updatePricePerHourMutation(numValue);
    }
  };

  const isSubmitDisabled = () => {
    const currentValue = mechanicData?.pricePerHour || 0;
    const numValue = parseInt(newPricePerHour, 10);

    return (
      isSubmitting ||
      isLoadingMechanic ||
      isNaN(numValue) ||
      numValue <= 0 ||
      numValue === currentValue
    );
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 pl-0"
        >
          <ArrowLeftIcon className="!h-5 !w-5" />
          Volver al Panel
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Configuración</h1>
        <p className="text-muted mt-1 text-sm sm:mt-0 sm:text-base">
          Administra tus preferencias de precios y configuración de tarifa por hora
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-md font-semibold sm:text-lg">Tarifa por Hora</h2>
            <p className="text-muted mt-1 text-sm sm:mt-0 sm:text-base">
              Establece tu tarifa por hora predeterminada para las reparaciones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500">€</span>
              </div>
              <Input
                id="pricePerHour"
                value={newPricePerHour}
                onChange={handleInputChange}
                type="number"
                className="pl-8"
                placeholder={isLoadingMechanic ? 'Cargando...' : 'Price'}
                required
                disabled={isLoadingMechanic}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitDisabled()}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionPage;
