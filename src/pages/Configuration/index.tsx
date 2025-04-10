import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { useMechanic } from '@/context/Mechanic.context';
import BodyText from '@/components/atoms/BodyText';
import Spinner from '@/components/atoms/Spinner';

const ConfiguracionPage = () => {
  const [newPricePerHour, setNewPricePerHour] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pricePerHour, updatePricePerHour } = useMechanic();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (pricePerHour !== undefined) {
      const eurosValue = (pricePerHour / 100).toFixed(2);
      setNewPricePerHour(eurosValue);
    }
  }, [pricePerHour]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');

    if (newPricePerHour === '0' && value === '00') {
      return;
    }

    if (newPricePerHour === '' && (e.target.value.includes('.') || e.target.value.includes(','))) {
      return;
    }

    if (value === '' || /^(\d*\.?\d{0,2})$/.test(value)) {
      setNewPricePerHour(value);
    }
  };

  const isSubmitDisabled = () => {
    const numValue = parseFloat(newPricePerHour);
    const currentValueInCents = pricePerHour || 0;
    const newValueInCents = Math.round(numValue * 100);

    return (
      isSubmitting ||
      newPricePerHour === '' ||
      isNaN(numValue) ||
      numValue <= 0 ||
      newValueInCents === currentValueInCents
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const valueInCents = Math.round(parseFloat(newPricePerHour) * 100);
      const res = await updatePricePerHour(valueInCents);

      if (res.status === 200) {
        enqueueSnackbar('Cambios guardados correctamente', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar('No se pudieron guardar los cambios', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error al guardar la tarifa:', error);
      enqueueSnackbar('No se pudieron guardar los cambios', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 font-bold">Configuración</h2>
      <BodyText>Administra tus preferencias de precios y configuración de tarifa por hora</BodyText>

      <form onSubmit={handleSubmit}>
        <div className="mb-8 rounded-lg bg-white p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold">Tarifa por Hora</h3>
          <BodyText>Establece tu tarifa por hora predeterminada para las reparaciones</BodyText>

          <div className="mb-3">
            <label htmlFor="pricePerHour" className="mb-1 block text-sm font-medium">
              Tarifa actual
            </label>
            <div className="flex rounded-md border">
              <div className="flex items-center bg-transparent px-3">€</div>
              <input
                id="pricePerHour"
                value={newPricePerHour}
                onChange={handleInputChange}
                type="text"
                placeholder="3.50"
                className="w-full border-0 p-2 focus:ring-0 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            disabled={isSubmitDisabled()}
            className="mt-4 min-w-[172px] rounded-md bg-black px-4 py-2 text-white disabled:bg-gray-400"
          >
            {isSubmitting ? <Spinner /> : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionPage;
