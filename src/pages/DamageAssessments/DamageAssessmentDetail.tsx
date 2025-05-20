import { useParams, Navigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useEffect } from 'react';
import { DamageAssessment } from '@/types/DamageAssessment';
import Spinner from '@/components/atoms/Spinner';
import { ImageIcon } from 'lucide-react';
import { UserRole } from '@/types/User';
import { useAuth } from '@/context/Auth.context';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import HeaderPage from '@/components/molecules/HeaderPage';
import { useCarPlateOrVin } from '@/hooks/useCarPlateOrVin';

const DamageAssessmentDetail = () => {
  const { damageAssessmentId } = useParams();
  const { user } = useAuth();
  const { execute, data, loading, error } = useApi<DamageAssessment>(
    'get',
    `/damage-assessments/${damageAssessmentId}`,
  );
  const carPlateOrVin = useCarPlateOrVin(data?.car);

  useEffect(() => {
    if (damageAssessmentId) execute();
  }, [damageAssessmentId]);

  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Cargando peritaje..." />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="text-destructive flex min-h-screen items-center justify-center">
        Error al cargar el peritaje
      </div>
    );
  }

  const { car, description, images, createdAt } = data;

  return (
    <div className="bg-background min-h-screen w-full">
      {/* NAVBAR */}
      <HeaderPage
        data={{
          title: 'Detalles del Peritaje',
          description: carPlateOrVin,
        }}
        onBack={() => window.history.back()}
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <VehicleInformation car={car} editMode={false} />

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Detalles del peritaje</h2>
          <div className="mb-4 min-h-[1.5em] text-xs text-gray-700">
            {description || <span className="text-gray-400 italic">Sin descripción</span>}
          </div>
          <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
            <ImageIcon className="h-4 w-4" />
            {images.length} imagen{images.length === 1 ? '' : 'es'}
          </div>
          {images.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`img-${idx}`}
                  className="h-20 w-full rounded border object-cover"
                />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs text-gray-400">
              Creado: {new Date(createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageAssessmentDetail;
