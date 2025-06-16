import { Navigate, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useState } from 'react';
import { DamageAssessment, Damage } from '@/types/DamageAssessment';
import Spinner from '@/components/atoms/Spinner';
import { ImageIcon } from 'lucide-react';
import { UserRole } from '@/types/User';
import { useAuth } from '@/context/Auth.context';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import HeaderPage from '@/components/molecules/HeaderPage';
import { useCarPlateOrVin } from '@/hooks/useCarPlateOrVin';
import DetailsContainer from '@/components/atoms/DetailsContainer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ImageCarousel } from '@/components/molecules/ImageCarousel';
import { ImageModal } from '@/components/molecules/ImageModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import DamageCard from '@/components/molecules/DamageCard/DamageCard';
import { ApiService } from '@/service/api.service';

const DamageAssessmentDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const apiService = ApiService.getInstance();

  // Hook personalizado que maneja toda la lógica del DamageAssessment
  const {
    damageAssessment,
    isLoading,
    error,
    isUpdating,
    isCurrentAssessmentLoaded,
    damages,
    isEditable,
    updateDamage,
    deleteDamage,
    updateDamageAssessmentNotes,
    damageAssessmentId,
  } = useDamageAssessmentDetailPage();

  // Lógica de confirmación de daños
  const { execute: confirmDamagesRequest } = useApi<DamageAssessment>(
    'post',
    `/damage-assessments/${damageAssessmentId}/confirm-damages`,
  );

  const { mutate: confirmDamagesMutation, isPending: isConfirmingDamages } = useMutation({
    mutationFn: () => {
      // Confirmar todos los daños existentes automáticamente
      const confirmedDamageIds = damages.map((damage) => damage._id!).filter(Boolean);
      return confirmDamagesRequest({
        confirmedDamageIds,
      });
    },
    onSuccess: () => {
      enqueueSnackbar('Daños confirmados correctamente.', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['damageAssessments'] });
      queryClient.invalidateQueries({ queryKey: ['damageAssessment', damageAssessmentId] });
      // Redirigir al informe después de confirmar
      navigate(`/damage-assessments/${damageAssessmentId}/report`);
    },
    onError: () => {
      enqueueSnackbar('Error al confirmar los daños. Por favor, intente de nuevo.', {
        variant: 'error',
      });
    },
  });

  const { mutate: updateDamageMutation } = useMutation({
    mutationFn: ({ damageId, damageData }: { damageId: string; damageData: Partial<Damage> }) => {
      return apiService.updateDamage(damageAssessmentId!, damageId, damageData);
    },
    onSuccess: () => {
      enqueueSnackbar('Daño actualizado correctamente.', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['damageAssessment', damageAssessmentId] });
    },
    onError: () => {
      enqueueSnackbar('Error al actualizar el daño. Por favor, intente de nuevo.', {
        variant: 'error',
      });
    },
  });

  const { mutate: deleteDamageMutation } = useMutation({
    mutationFn: (damageId: string) => {
      return apiService.deleteDamage(damageAssessmentId!, damageId);
    },
    onSuccess: () => {
      enqueueSnackbar('Daño eliminado correctamente.', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['damageAssessment', damageAssessmentId] });
    },
    onError: () => {
      enqueueSnackbar('Error al eliminar el daño. Por favor, intente de nuevo.', {
        variant: 'error',
      });
    },
  });

  const carPlateOrVin = useCarPlateOrVin(damageAssessment?.car);

  // Verificar permisos
  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Estados de carga
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Cargando peritaje..." />
      </div>
    );
  }

  if (error || !isCurrentAssessmentLoaded) {
    return (
      <div className="text-destructive flex min-h-screen items-center justify-center">
        Error al cargar el peritaje
      </div>
    );
  }

  if (!damageAssessment) {
    return (
      <div className="text-destructive flex min-h-screen items-center justify-center">
        Peritaje no encontrado
      </div>
    );
  }

  const { car, description, images, createdAt, state } = damageAssessment;

  // Mostrar solo daños confirmados si el estado es 'DAMAGES_CONFIRMED'
  const damagesToShow =
    state === 'DAMAGES_CONFIRMED' ? damages.filter((damage) => damage.isConfirmed) : damages;

  const handleUpdateDamage = (updatedDamage: Damage) => {
    if (updatedDamage._id) {
      updateDamage(updatedDamage._id, updatedDamage);
    }
  };

  const handleUpdateDamage = (updatedDamage: Damage) => {
    if (updatedDamage._id) {
      updateDamageMutation({
        damageId: updatedDamage._id,
        damageData: updatedDamage,
      });
    }
  };

  const handleDeleteDamage = (damageId: string) => {
    deleteDamageMutation(damageId);
  };

  const isEditable = state !== 'DAMAGES_CONFIRMED';

  return (
    <div className="bg-background min-h-screen w-full">
      <HeaderPage
        data={{
          title: 'Detalles del Peritaje',
          description: carPlateOrVin,
        }}
        onBack={() => navigate('/damage-assessments')}
      />

      <DetailsContainer>
        {/* Layout responsive: dos columnas en desktop, una columna en mobile */}
        <div className={`${isMobile ? '' : 'flex gap-6'}`}>
          {/* Contenido principal */}
          <div className={`${isMobile ? '' : 'min-w-0 flex-1'}`}>
            <VehicleInformation car={car} editMode={false} />

            <div
              className={`mt-4 ${isMobile ? 'bg-transparent' : 'rounded-lg bg-white p-6 shadow-md'}`}
            >
              {/* Información del peritaje */}
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

                {/* Carousel de imágenes */}
                {images.length > 0 &&
                  (isMobile ? (
                    <ImageCarousel
                      images={images}
                      showDeleteButton={false}
                      onImageClick={(index) => {
                        setImageModalOpen(true);
                        setSelectedImageIndex(index);
                      }}
                    />
                  ) : (
                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`img-${idx}`}
                          className="aspect-square w-full cursor-pointer rounded border border-gray-200 object-cover transition-opacity hover:opacity-80"
                          onClick={() => {
                            setImageModalOpen(true);
                            setSelectedImageIndex(idx);
                          }}
                        />
                      ))}
                    </div>
                  ))}
              </div>

              {/* Lista de daños */}
              <div className={`${isMobile ? '' : 'mt-6'}`}>
                <h3
                  className={`text-base font-semibold ${isMobile ? 'bg-gray-50 px-4 py-3' : 'mb-2'}`}
                >
                  {state === 'DAMAGES_CONFIRMED' ? 'Daños Confirmados' : 'Daños detectados'}
                </h3>

                {/* Indicador de actualización */}
                {isUpdating && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-blue-600">
                    <Spinner className="h-4 w-4" label="" />
                    Actualizando...
                  </div>
                )}

                {damagesToShow.length === 0 && (
                  <div className={`text-xs text-gray-400 italic ${isMobile ? 'bg-white p-4' : ''}`}>
                    {state === 'DAMAGES_CONFIRMED'
                      ? 'No se confirmaron daños'
                      : 'No se detectaron daños'}
                  </div>
                )}

                {damagesToShow.map((damage, idx) => (
                  <DamageCard
                    key={damage._id || idx}
                    damage={damage}
                    onUpdateDamage={handleUpdateDamage}
                    onDeleteDamage={handleDeleteDamage}
                    isEditable={isEditable}
                  />
                ))}
              </div>
            )}
            {damagesToShow.map((damage, idx) => (
              <DamageCard
                key={damage._id || idx}
                damage={damage}
                onUpdateDamage={handleUpdateDamage}
                onDeleteDamage={handleDeleteDamage}
                isEditable={isEditable}
              />
            ))}
          </div>

          {/* Desglose de costes - Solo en desktop */}
          {!isMobile && (
            <div className="flex-shrink-0">
              <CostBreakdown
                damageAssessment={damageAssessment}
                onUpdateNotes={(notes) => {
                  updateDamageAssessmentNotes(notes);
                }}
                onConfirmDamages={handleConfirmDamages}
                isConfirming={isConfirmingDamages}
                onViewReport={handleViewReport}
              />
            </div>
          )}
        </div>

        {isMobile && (
          <>
            <div className="px-4 pb-4 text-center text-xs text-gray-500">
              Creado: {new Date(createdAt).toLocaleString()}
            </div>

            {/* Desglose de costes - Versión móvil */}
            <div className="px-4 pb-4">
              <CostBreakdown
                damageAssessment={damageAssessment}
                onUpdateNotes={(notes) => {
                  updateDamageAssessmentNotes(notes);
                }}
                onConfirmDamages={handleConfirmDamages}
                isConfirming={isConfirmingDamages}
                onViewReport={handleViewReport}
              />
            </div>
          </>
        )}
      </DetailsContainer>

      {imageModalOpen && (
        <ImageModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          images={images}
          initialIndex={selectedImageIndex}
        />
      )}
    </div>
  );
};

export default DamageAssessmentDetail;
