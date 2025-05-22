import { useParams, Navigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useEffect } from 'react';
import { DamageAssessment, Damage, DamageSeverity, DamageType } from '@/types/DamageAssessment';
import Spinner from '@/components/atoms/Spinner';
import { ImageIcon } from 'lucide-react';
import { UserRole } from '@/types/User';
import { useAuth } from '@/context/Auth.context';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import HeaderPage from '@/components/molecules/HeaderPage';
import { useCarPlateOrVin } from '@/hooks/useCarPlateOrVin';
import DetailsContainer from '@/components/atoms/DetailsContainer';
import PartDiagramItem from '@/components/molecules/PartDiagramItem';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ImageCarousel } from '@/components/molecules/ImageCarousel';

const severityLabelMap = {
  [DamageSeverity.HIGH]: 'Alto',
  [DamageSeverity.MEDIUM]: 'Medio',
  [DamageSeverity.LOW]: 'Bajo',
};

const typeLabelMap = {
  [DamageType.DENT]: 'Abolladura',
  [DamageType.SCRATCH]: 'Rayón',
};

const DamageCard = ({ damage }: { damage: Damage }) => {
  const isMobile = useIsMobile();

  const getSeverityColor = (severity: DamageSeverity) => {
    switch (severity) {
      case DamageSeverity.HIGH:
        return 'bg-red-100 text-red-800 border-red-200';
      case DamageSeverity.MEDIUM:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case DamageSeverity.LOW:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };
  return (
    <div
      className={`mb-4 p-4 ${isMobile ? 'rounded-lg bg-white shadow-md' : 'rounded border border-gray-100 bg-white shadow-sm'}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-700">
          Área: {damage.area} - {damage.subarea}
        </span>
        <span className={`rounded border px-2 py-1 text-xs ${getSeverityColor(damage.severity)}`}>
          {severityLabelMap[damage.severity]}
        </span>
      </div>
      <div className="font-medium text-gray-600">Tipo: {typeLabelMap[damage.type]}</div>
      <div className="mt-2 text-gray-600 italic">{damage.description}</div>
      {damage.resources && damage.resources.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-700">Tiempos de Baremo:</h4>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {damage.resources.map((resource, index) => (
              <PartDiagramItem
                key={index}
                title={resource.label}
                onClick={() => window.open(resource.url, '_blank')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DamageAssessmentDetail = () => {
  const { damageAssessmentId } = useParams();
  const { user } = useAuth();
  const { execute, data, loading, error } = useApi<DamageAssessment>(
    'get',
    `/damage-assessments/${damageAssessmentId}`,
  );
  const carPlateOrVin = useCarPlateOrVin(data?.car);
  const isMobile = useIsMobile();

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

  const { car, description, images, createdAt, damages = [] } = data;

  return (
    <div className="bg-background min-h-screen w-full">
      <HeaderPage
        data={{
          title: 'Detalles del Peritaje',
          description: carPlateOrVin,
        }}
        onBack={() => window.history.back()}
      />

      <DetailsContainer>
        <VehicleInformation car={car} editMode={false} />

        <div
          className={`mt-4 ${isMobile ? 'bg-transparent' : 'rounded-lg bg-white p-6 shadow-md'}`}
        >
          <div className={`${isMobile ? 'mb-4 rounded-lg bg-white p-4 shadow-md' : ''}`}>
            <h2 className={`mb-4 text-lg font-semibold ${isMobile ? 'px-0 pt-0' : ''}`}>
              Detalles del peritaje
            </h2>
            <div className="mb-4 min-h-[1.5em] text-xs text-gray-700">
              {description || <span className="text-gray-400 italic">Sin descripción</span>}
            </div>
            <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
              <ImageIcon className="h-4 w-4" />
              {images.length} imagen{images.length === 1 ? '' : 'es'}
            </div>

            {images.length > 0 &&
              (isMobile ? (
                <ImageCarousel images={images} showDeleteButton={false} />
              ) : (
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`img-${idx}`}
                      className="aspect-square w-full cursor-pointer rounded border border-gray-200 object-cover transition-opacity hover:opacity-80"
                      onClick={() => console.log('Abrir imagen en modal: ', img)}
                    />
                  ))}
                </div>
              ))}
          </div>

          <div className={`${isMobile ? '' : 'mt-6'}`}>
            <h3 className={`text-base font-semibold ${isMobile ? 'bg-gray-50 px-4 py-3' : 'mb-2'}`}>
              Daños detectados
            </h3>
            {damages.length === 0 && (
              <div className={`text-xs text-gray-400 italic ${isMobile ? 'bg-white p-4' : ''}`}>
                No se detectaron daños
              </div>
            )}
            {damages.map((damage, idx) => (
              <DamageCard key={idx} damage={damage} />
            ))}
          </div>

          {!isMobile && (
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">
                Creado: {new Date(createdAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        {isMobile && (
          <div className="px-4 pb-4 text-center text-xs text-gray-500">
            Creado: {new Date(createdAt).toLocaleString()}
          </div>
        )}
      </DetailsContainer>
    </div>
  );
};

export default DamageAssessmentDetail;
