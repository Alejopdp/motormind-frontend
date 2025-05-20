import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { useSnackbar } from 'notistack';
import { useApi } from '@/hooks/useApi';
import { useFileUpload } from '@/hooks/useFileUpload';
import Spinner from '@/components/atoms/Spinner';
import { useAuth } from '@/context/Auth.context';
import { UserRole } from '@/types/User';
import { Navigate } from 'react-router-dom';
import { useDamageAssessment } from '@/context/DamageAssessment.context';

const DamageDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, setDetails, reset } = useDamageAssessment();
  const { execute: createDamageAssessment } = useApi<{ id: string }>('post', '/damage-assessments');
  const { upload, isLoading: isUploading } = useFileUpload();
  const { user } = useAuth();

  const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role);

  if (!isAdmin) return <Navigate to="/" replace />;

  const noImages = !data.images.length;

  if (noImages) {
    navigate(`/damage-assessments/${carId}/create`);
    return null;
  }

  const handleCreateAssessment = async () => {
    try {
      setIsSubmitting(true);

      console.log({ data });
      // 1. Subir imágenes
      const uploadResult = await upload(data.images, { carId: carId! });

      // 2. Crear el peritaje con los links de las imágenes
      const response = await createDamageAssessment({
        carId,
        details: data.details,
        images: uploadResult.keys,
      });

      enqueueSnackbar('Peritaje creado exitosamente', { variant: 'success' });
      navigate(`/damage-assessments/${response.data.id}`);
      reset();
    } catch (error) {
      console.error('Error al crear el peritaje:', error);
      enqueueSnackbar('Error al crear el peritaje', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting || isUploading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Creando peritaje..." />
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen w-full flex-row">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-semibold">Detalles del Peritaje</h2>

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

          <Button className="mt-6 w-full" onClick={handleCreateAssessment}>
            Crear Peritaje
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DamageDetails;
