import { useEffect, useState } from 'react';
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
import { useDamageAssessment } from '@/context/DamageAssessment.context';
import { Textarea } from '@/components/atoms/Textarea';
import { useFileUpload } from '@/hooks/useFileUpload';

const CreateDamageAssessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const carId = searchParams.get('carId');
  const step = Number(searchParams.get('step') || 1);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, setImages, setDetails, reset } = useDamageAssessment();
  const { execute: getCarById } = useApi<Car>('get', '/cars/:carId');
  const { execute: createDamageAssessment } = useApi<{ _id: string }>(
    'post',
    '/damage-assessments',
  );
  const { upload, isLoading: isUploading } = useFileUpload();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Error cargando el vehículo', { variant: 'error' });
      navigate('/damage-assessments');
    }
  }, [isError, navigate, enqueueSnackbar]);

  useEffect(() => {
    if (!carId) {
      navigate('/damage-assessments');
    }
  }, [carId, navigate]);

  const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role);
  if (!isAdmin) return <Navigate to="/" replace />;

  const goToStep = (n: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('step', String(n));
      return params;
    });
  };

  const handleNext = () => goToStep(step + 1);
  const handleBack = () => goToStep(step - 1);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // 1. Subir imágenes
      const uploadResult = await upload(data.images, { carId: carId! });
      // 2. Crear el peritaje
      const response = await createDamageAssessment({
        carId,
        details: data.details,
        images: uploadResult.keys,
      });
      enqueueSnackbar('Peritaje creado exitosamente', { variant: 'success' });
      reset();
      navigate(`/damage-assessments/${response.data._id}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al crear el peritaje', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isUploading || isSubmitting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Cargando..." />
      </div>
    );
  }

  if (isError || !car) {
    return null;
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

          {/* Paso 1: Cargar imágenes */}
          {step === 1 && (
            <>
              <ImageUploadStep images={data.images} onImagesChange={setImages} />
              <div className="mt-6 flex w-full gap-2">
                <Button className="w-full" onClick={handleNext} disabled={data.images.length === 0}>
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {/* Paso 2: Descripción */}
          {step === 2 && (
            <>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Detalles de la avería (opcional)
                </label>
                <Textarea
                  value={data.details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe los detalles de la avería..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="mt-6 flex w-full gap-2">
                <Button className="w-1/2" variant="outline" onClick={handleBack}>
                  Atrás
                </Button>
                <Button className="w-1/2" onClick={handleSubmit}>
                  Crear Peritaje
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDamageAssessment;
