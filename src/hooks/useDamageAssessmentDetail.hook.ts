import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDamageAssessmentDetail } from '@/context/DamageAssessment.context';

/**
 * Hook que maneja automáticamente la carga del DamageAssessment
 * cuando se ingresa al detalle de un peritaje.
 * 
 * Se ejecuta automáticamente cuando:
 * - Se monta el componente
 * - Cambia el ID del DamageAssessment en la URL
 * - El ID actual es diferente al que está en el contexto
 */
export const useDamageAssessmentDetailPage = () => {
    const { damageAssessmentId } = useParams<{ damageAssessmentId: string }>();
    const damageAssessmentDetail = useDamageAssessmentDetail();

    const {
        damageAssessment,
        isLoading,
        error,
        loadDamageAssessment,
        isUpdating,
        updateDamage,
        deleteDamage,
        updateDamageAssessmentNotes,
        startEditingDamage,
        stopEditingDamage,
        getDamageById,
        isEditingDamage,
        editingDamageId,
        refreshDamageAssessment,
    } = damageAssessmentDetail;

    // Cargar el damage assessment automáticamente cuando cambie el ID
    useEffect(() => {
        if (damageAssessmentId && damageAssessmentId !== damageAssessment?._id) {
            loadDamageAssessment(damageAssessmentId);
        }
    }, [damageAssessmentId, damageAssessment?._id, loadDamageAssessment]);

    // Helpers específicos para la página de detalle
    const isCurrentAssessmentLoaded = Boolean(
        damageAssessmentId &&
        damageAssessment?._id === damageAssessmentId
    );

    const damages = damageAssessment?.damages || [];

    const confirmedDamages = damages.filter(damage => damage.isConfirmed === true);

    const pendingDamages = damages.filter(damage => damage.isConfirmed !== true);

    const isEditable = damageAssessment?.state !== 'DAMAGES_CONFIRMED';

    return {
        // Estados de carga y datos
        damageAssessment,
        isLoading,
        error,
        isUpdating,
        isCurrentAssessmentLoaded,

        // Datos procesados
        damages,
        confirmedDamages,
        pendingDamages,
        isEditable,

        // Métodos de acción
        updateDamage,
        deleteDamage,
        updateDamageAssessmentNotes,
        refreshDamageAssessment,

        // Estados y métodos de edición
        editingDamageId,
        startEditingDamage,
        stopEditingDamage,
        getDamageById,
        isEditingDamage,

        // ID actual
        damageAssessmentId,
    };
}; 