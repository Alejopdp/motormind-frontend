import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useWorkshop } from '@/context/Workshop.context';
import HeaderPage from '@/components/molecules/HeaderPage';

const Settings = () => {
  const navigate = useNavigate();
  const { workshop, isLoading, updateWorkshop } = useWorkshop();
  const { enqueueSnackbar } = useSnackbar();
  const [newPricePerHour, setNewPricePerHour] = useState<string>('');
  const [newBodyworkHourlyRate, setNewBodyworkHourlyRate] = useState<string>('');

  // Inicializar valores cuando el workshop se carga
  useEffect(() => {
    if (workshop) {
      setNewPricePerHour((workshop.pricePerHour || 0).toString());
      setNewBodyworkHourlyRate((workshop.bodyworkHourlyRate || 0).toString());
    }
  }, [workshop]);

  const { mutate: updatePricePerHourMutation, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: { pricePerHour: number; bodyworkHourlyRate: number }) => {
      await updateWorkshop(data);
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

  const handleBodyworkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Si está vacío, permitir borrar
    if (value === '') {
      setNewBodyworkHourlyRate('');
      return;
    }

    // Convertir a número y validar
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setNewBodyworkHourlyRate(numValue.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mechanicPrice = parseInt(newPricePerHour, 10);
    const bodyworkPrice = parseInt(newBodyworkHourlyRate, 10);
    if (mechanicPrice > 0 && bodyworkPrice > 0) {
      updatePricePerHourMutation({
        pricePerHour: mechanicPrice,
        bodyworkHourlyRate: bodyworkPrice,
      });
    }
  };

  const isSubmitDisabled = () => {
    const currentMechanicPrice = workshop?.pricePerHour || 0;
    const currentBodyworkPrice = workshop?.bodyworkHourlyRate || 0;
    const mechanicPrice = parseInt(newPricePerHour, 10);
    const bodyworkPrice = parseInt(newBodyworkHourlyRate, 10);

    return (
      isSubmitting ||
      isLoading ||
      isNaN(mechanicPrice) ||
      isNaN(bodyworkPrice) ||
      mechanicPrice <= 0 ||
      bodyworkPrice <= 0 ||
      (mechanicPrice === currentMechanicPrice && bodyworkPrice === currentBodyworkPrice)
    );
  };

  return (
    <div className="bg-background flex h-screen flex-grow flex-col">
      <HeaderPage
        data={{
          title: 'Configuración',
          description: 'Administra tus preferencias de precios y configuración de tarifa por hora',
        }}
        onBack={() => navigate(-1)}
      />
      <div className="container mx-auto px-4 py-3 sm:px-8 sm:py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-md font-semibold sm:text-lg">Tarifa por Hora</h2>
              <p className="text-muted mt-1 text-sm sm:mt-0 sm:text-base">
                Establece tus tarifas por hora para mecánica y carrocería
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pricePerHour"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Precio por hora - Mecánica
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">€</span>
                  </div>
                  <Input
                    id="pricePerHour"
                    value={newPricePerHour}
                    onChange={handleInputChange}
                    type="number"
                    className="pl-8"
                    placeholder={isLoading ? 'Cargando...' : 'Precio mecánica'}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bodyworkHourlyRate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Precio por hora - Carrocería
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">€</span>
                  </div>
                  <Input
                    id="bodyworkHourlyRate"
                    value={newBodyworkHourlyRate}
                    onChange={handleBodyworkInputChange}
                    type="number"
                    className="pl-8"
                    placeholder={isLoading ? 'Cargando...' : 'Precio carrocería'}
                    required
                    disabled={isLoading}
                  />
                </div>
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
    </div>
  );
};

export default Settings;
