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
import { useDamageAssessmentCreation } from '@/context/DamageAssessment.context';
import { Textarea } from '@/components/atoms/Textarea';
import { useFileUpload } from '@/hooks/useFileUpload';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import HeaderPage from '@/components/molecules/HeaderPage';
import DetailsContainer from '@/components/atoms/DetailsContainer';
import { useIsMobile } from '@/hooks/useIsMobile';

const loadingMessages = [
  'Este proceso puede tardar unos minutos, por favor espere...',
  'Recibimos los datos y los estamos procesando para crear el peritaje',
  'Analizando las imágenes del auto',
  'Detectando los daños del auto',
  'Buscando recursos para obtener más información',
  'Creando el peritaje con toda la información recabada',
  'Ya casi terminamos, por favor espere un poco más',
];

const CreateDamageAssessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const carId = searchParams.get('carId');
  const step = Number(searchParams.get('step') || 1);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, setImages, setDetails, reset } = useDamageAssessmentCreation();
  const { execute: getCarById } = useApi<Car>('get', '/cars/:carId');
  const { execute: createDamageAssessment } = useApi<{ _id: string }>(
    'post',
    '/damage-assessments',
  );
  const { upload, isLoading: isUploading } = useFileUpload();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(0);
  const isMobile = useIsMobile();

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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (isLoading || isUploading || isSubmitting) {
      setCurrentLoadingMessageIndex(0);
      intervalId = setInterval(() => {
        setCurrentLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 20000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading, isUploading, isSubmitting]);

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
      // Validar que insuranceCompany esté presente (es obligatorio)
      if (!insuranceCompany) {
        enqueueSnackbar('Error: La aseguradora es obligatoria para crear un peritaje', {
          variant: 'error',
        });
        return;
      }

      const response = await createDamageAssessment({
        carId,
        description: data.details,
        images: uploadResult.keys,
        insuranceCompany, // Obligatorio
        ...(claimNumber && { claimNumber }), // Opcional
      });
      enqueueSnackbar('Peritaje creado exitosamente', { variant: 'success' });
      reset(); // Resetear contexto solo después de éxito
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
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <Spinner label={loadingMessages[currentLoadingMessageIndex]} />
      </div>
    );
  }

  if (isError || !car) {
    return null;
  }

  const mainContainerMobilePaddingBottom = isMobile
    ? step === 1
      ? 'pb-20'
      : step === 2
        ? 'pb-36'
        : ''
    : '';

  return (
    <div className={`bg-background min-h-screen ${mainContainerMobilePaddingBottom}`}>
      <HeaderPage
        data={{ title: 'Nuevo Peritaje' }}
        onBack={() => navigate('/damage-assessments')}
      />
      <DetailsContainer>
        {step === 1 && (
          <div
            className={`w-full ${isMobile ? 'flex flex-grow flex-col' : 'rounded-lg bg-white p-8 shadow-md'}`}
          >
            <ImageUploadStep images={data.images} onImagesChange={setImages} />
            <div
              className={`flex w-full gap-2 ${
                isMobile
                  ? 'shadow-t-md fixed bottom-0 left-0 z-10 mt-auto w-full bg-white p-4'
                  : 'mt-6'
              }`}
            >
              <Button
                className={`w-full md:mx-auto md:w-1/2 ${isMobile ? '' : ''}`}
                onClick={handleNext}
                disabled={data.images.length === 0}
                size={isMobile ? 'lg' : 'default'}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <VehicleInformation car={car} editMode={false} />

            {/* Información del siniestro */}
            {insuranceCompany && (
              <div
                className={`mb-6 ${isMobile ? 'rounded-lg bg-white p-4 shadow-md' : 'rounded-lg bg-white p-6 shadow-md'}`}
              >
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Datos del Siniestro</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Aseguradora:</span>
                    <span className="text-sm font-medium text-gray-900">{insuranceCompany}</span>
                  </div>
                  {claimNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Número de siniestro:</span>
                      <span className="text-sm font-medium text-gray-900">{claimNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Detalles de los daños (opcional)
              </label>
              <Textarea
                value={data.details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe los detalles de los daños..."
                className="min-h-[120px]"
              />
            </div>
            <div
              className={`flex gap-2 ${
                isMobile
                  ? 'shadow-t-md fixed bottom-0 left-0 z-10 w-full flex-col bg-white p-4'
                  : 'mt-6 ml-auto max-w-md flex-row-reverse'
              }`}
            >
              <Button
                className={`${isMobile ? 'w-full' : 'w-1/2'}`}
                onClick={handleSubmit}
                size={isMobile ? 'lg' : 'default'}
              >
                Crear Peritaje
              </Button>
              <Button
                className={`${isMobile ? 'w-full' : 'w-1/2'}`}
                variant="outline"
                onClick={handleBack}
                size={isMobile ? 'lg' : 'default'}
              >
                Atrás
              </Button>
            </div>
          </>
        )}
      </DetailsContainer>
    </div>
  );
};

export default CreateDamageAssessment;
