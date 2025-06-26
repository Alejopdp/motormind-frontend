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
import HeaderPage from '@/components/molecules/HeaderPage';
import DetailsContainer from '@/components/atoms/DetailsContainer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { CircleCheckBig } from 'lucide-react';

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
  const [searchParams] = useSearchParams();
  const carId = searchParams.get('carId');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, setImages, setDetails, reset } = useDamageAssessmentCreation();
  // Obtener datos del siniestro desde el contexto
  const { insuranceCompany, claimNumber } = data;

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

  const mainContainerMobilePaddingBottom = isMobile ? 'pb-20' : '';

  return (
    <div className={`bg-background min-h-screen ${mainContainerMobilePaddingBottom}`}>
      <HeaderPage
        data={{ title: 'Nuevo Peritaje' }}
        onBack={() => navigate('/damage-assessments')}
      />
      <DetailsContainer>
        <div className={`w-full ${isMobile ? 'flex flex-grow flex-col' : ''}`}>
          {isMobile ? (
            // Vista móvil - mantener el layout original
            <div className="flex flex-grow flex-col">
              <div className="rounded-lg bg-white p-4 shadow-md">
                <ImageUploadStep images={data.images} onImagesChange={setImages} />
              </div>

              {/* Observaciones móvil */}
              <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Observaciones adicionales (opcional)
                </label>
                <Textarea
                  value={data.details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Agrega cualquier observación o detalle adicional sobre los daños..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Botón móvil */}
              <div className="shadow-t-md fixed bottom-0 left-0 z-10 mt-auto w-full bg-white p-4">
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={data.images.length === 0}
                  size="lg"
                >
                  Enviar a Análisis IA
                </Button>
              </div>
            </div>
          ) : (
            // Vista desktop - replicar exactamente el layout de DamageAssessmentDetail
            <div className="flex gap-6">
              {/* Columna principal - Igual que DamageAssessmentDetail */}
              <div className="min-w-0 flex-1">
                {/* Sección Fotos del Vehículo */}
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Fotos del Vehículo</h2>
                  <ImageUploadStep images={data.images} onImagesChange={setImages} />
                </div>

                {/* Sección Observaciones */}
                <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                  <label className="mb-3 block text-lg font-semibold text-gray-900">
                    Observaciones
                  </label>
                  <Textarea
                    value={data.details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Agrega cualquier observación o detalle adicional sobre los daños..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              {/* Card Fotos recomendadas - Fixed como CostBreakdown */}
              <div className="fixed right-4 bottom-4 z-20 h-fit w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:top-26 md:right-16">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Fotos recomendadas</h3>

                <div className="space-y-3">
                  {[
                    'Vista Frontal Completa',
                    'Vista Trasera Completa',
                    'Lateral Izquierdo',
                    'Lateral Derecho',
                    'Matrícula Clara',
                    'Número de Bastidor (VIN)',
                    'Kilometraje del Odómetro',
                    'Daño Principal Detalle 1',
                    'Daño Principal Detalle 2',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CircleCheckBig className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-gray-500 italic">
                  Esta lista es una guía para ayudarte a capturar todas las fotos necesarias para el
                  peritaje.
                </p>

                {/* Botón de acción */}
                <div className="mt-6">
                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={data.images.length === 0}
                    size="default"
                  >
                    Enviar a Análisis IA
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DetailsContainer>
    </div>
  );
};

export default CreateDamageAssessment;
