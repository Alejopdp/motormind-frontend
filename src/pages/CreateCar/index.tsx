import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Spinner from '@/components/atoms/Spinner';
import { useApi } from '@/hooks/useApi';
import { Car } from '@/types/Car';

const CreateCar = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { execute } = useApi<Car>('post', '/cars');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await execute({
        brand,
        model,
        year,
        plate,
      });

      if (response.status === 200) {
        enqueueSnackbar('Vehículo creado correctamente', {
          variant: 'success',
        });
        navigate(`/cars/${response.data._id}`);
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error al crear el vehículo', {
        variant: 'error',
      });
      setIsSubmitting(false);
    }
  };

  const isFormValid = brand && model && year && plate;

  return (
    <div className="container mx-auto py-4">
      <h2 className="mb-4">Registrar Nuevo Vehículo</h2>
      <div className="rounded-lg bg-white shadow">
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-3">
                <div>
                  <label htmlFor="brand" className="mb-1 block font-medium">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="brand"
                    placeholder="Ej: Toyota"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    className="w-full rounded-md border p-2"
                  />
                </div>
              </div>
              <div className="mb-3">
                <div>
                  <label htmlFor="model" className="mb-1 block font-medium">
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="model"
                    placeholder="Ej: Corolla"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    className="w-full rounded-md border p-2"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-3">
                <div>
                  <label htmlFor="year" className="mb-1 block font-medium">
                    Año <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="year"
                    placeholder="Ej: 2020"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full rounded-md border p-2"
                  />
                </div>
              </div>
              <div className="mb-3">
                <div>
                  <label htmlFor="plate" className="mb-1 block font-medium">
                    Matrícula <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="plate"
                    placeholder="Ej: ABC123"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    required
                    className="w-full rounded-md border p-2"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="min-w-[150px] rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isSubmitting ? <Spinner /> : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCar;
