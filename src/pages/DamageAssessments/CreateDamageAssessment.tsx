import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { useApi } from '@/hooks/useApi';
import Spinner from '@/components/atoms/Spinner';
import { Car } from '@/types/Car';
import { ImageUploadStep } from '@/components/molecules/ImageUploadStep';
import { useSnackbar } from 'notistack';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/Auth.context';
import { UserRole } from '@/types/User';
import { Navigate } from 'react-router-dom';

const CreateDamageAssessment = () => {
  const [searchParams] = useSearchParams();
  const carId = searchParams.get('carId');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [images, setImages] = useState<File[]>([]);
  const { execute: getCarById } = useApi<Car>('get', '/cars/:carId');
  const { user } = useAuth();

  // Usar useQuery para manejar la carga del auto
  const {
    data: car,
    isLoading,
    isError,
  } = useQuery<Car>({
    queryKey: ['car', carId],
    queryFn: async () => {
      if (!carId) throw new Error('No car ID provided');
      const res = await getCarById(undefined, undefined, { carId });
      return res.data;
    },
    enabled: !!carId,
    retry: false,
  });

  // Manejar errores
  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Error cargando el vehículo', { variant: 'error' });
      navigate('/damage-assessments');
    }
  }, [isError, navigate, enqueueSnackbar]);

  // Redirigir si no hay carId
  useEffect(() => {
    if (!carId) {
      navigate('/damage-assessments');
    }
  }, [carId, navigate]);

  // Redirigir si no es admin
  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const handleContinue = () => {
    // Redirigir a la pantalla de detalles con las imágenes en el estado
    navigate(`/damage-assessments/${carId}/details`, {
      state: { images },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Cargando vehículo..." />
      </div>
    );
  }

  if (isError || !car) {
    return null; // La redirección se maneja en el efecto
  }

  return (
    <div className="bg-background flex min-h-screen w-full flex-row">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-semibold">Nuevo Peritaje</h2>
          <div className="mb-6">
            <div className="mb-2 text-center text-lg font-medium">Vehículo seleccionado:</div>
            <div className="rounded bg-gray-50 p-3 text-center text-sm">
              <div>
                <b>Marca:</b> {car.brand}
              </div>
              <div>
                <b>Modelo:</b> {car.model}
              </div>
              <div>
                <b>Matrícula:</b> {car.plate}
              </div>
              <div>
                <b>VIN:</b> {car.vinCode}
              </div>
            </div>
          </div>
          <ImageUploadStep images={images} onImagesChange={setImages} />
          <Button className="mt-6 w-full" onClick={handleContinue} disabled={images.length === 0}>
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateDamageAssessment;
