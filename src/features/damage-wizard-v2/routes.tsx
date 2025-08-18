import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams, Navigate } from 'react-router-dom';
import { WizardV2Provider, useWizardV2 } from './context/WizardV2Context';
import { WorkflowStatus } from './types';
import { BackendDamage, BackendDamageAssessment } from './types/backend.types';
import damageAssessmentApi from '@/service/damageAssessmentApi.service';
import Intake from './pages/Intake';
import Damages from './pages/Damages';
import Operations from './pages/Operations';
import Valuation from './pages/Valuation';
import Finalize from './pages/Finalize';

const WIZARD_V2_ENABLED = import.meta.env.VITE_WIZARD_V2_ENABLED === 'true';

// Función para extraer el step de los search params
const extractStepFromUrl = (searchParams: URLSearchParams): string => {
  return searchParams.get('step') || 'damages';
};

// ============================================================================
// COMPONENTE PRINCIPAL DEL ROUTER
// ============================================================================

export const WizardV2Entry = () => {
  const { id } = useParams<{ id: string }>();
  const [assessmentData, setAssessmentData] = useState<BackendDamageAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const loadAssessmentData = async () => {
    if (!id) {
      setError('ID no proporcionado');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await damageAssessmentApi.getAssessment(id);
      if (!mounted) return;
      setAssessmentData(response);
    } catch (error: unknown) {
      if (!mounted) return;
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading assessment data:', error);
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAssessmentData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando peritaje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-600">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Error al cargar el peritaje</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={loadAssessmentData}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl text-gray-600">❓</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Peritaje no encontrado</h2>
          <p className="text-gray-600">No se pudo cargar la información del peritaje.</p>
        </div>
      </div>
    );
  }

  return (
    <WizardV2Provider>
      <WizardV2Router assessmentData={assessmentData} />
    </WizardV2Provider>
  );
};

// ============================================================================
// ROUTER INTERNO
// ============================================================================

interface WizardV2RouterProps {
  assessmentData: BackendDamageAssessment;
}

const WizardV2Router = ({ assessmentData }: WizardV2RouterProps) => {
  const [searchParams] = useSearchParams();
  const step = extractStepFromUrl(searchParams);
  const { dispatch } = useWizardV2();

  // Cargar los datos del assessment en el contexto si están disponibles
  useEffect(() => {
    if (assessmentData) {
      // Establecer el assessmentId si está disponible
      if (assessmentData._id) {
        dispatch({ type: 'SET_ASSESSMENT_ID', payload: assessmentData._id });
      }

      // Cargar detectedDamages si están disponibles
      if (assessmentData.detectedDamages) {
        dispatch({ type: 'SET_DETECTED_DAMAGES', payload: assessmentData });
      }

      // Cargar confirmedDamages si están disponibles
      if (assessmentData.confirmedDamages && assessmentData.confirmedDamages.length > 0) {
        dispatch({
          type: 'CONFIRM_DAMAGES',
          payload: {
            ids: assessmentData.confirmedDamages.map(
              (d: BackendDamage) => d._id || `${d.area}-${d.subarea}`,
            ),
            damages: assessmentData.confirmedDamages,
          },
        });
      }

      const workflowStatus = assessmentData.workflow?.status;
      if (workflowStatus) {
        dispatch({ type: 'SET_STATUS', payload: workflowStatus as WorkflowStatus });
      }
    }
  }, [assessmentData, step]); // Removido dispatch para evitar bucle infinito

  const Component = useMemo(() => {
    switch (step) {
      case 'intake':
        return <Intake />;
      case 'damages':
        return <Damages />;
      case 'operations':
        return <Operations />;
      case 'valuation':
        return <Valuation />;
      case 'finalize':
        return <Finalize />;
      default:
        return <Damages />;
    }
  }, [step]);

  return Component;
};

// ============================================================================
// ENTRADA PARA CREAR NUEVO ASSESSMENT (sin ID)
// ============================================================================

export const WizardV2NewEntry = () => {
  // Verificar si el wizard está habilitado
  if (!WIZARD_V2_ENABLED) {
    return <Navigate to="/damage-assessments/create" />;
  }

  // Para crear un nuevo assessment, simplemente mostramos el primer paso
  return (
    <WizardV2Provider>
      <Intake />
    </WizardV2Provider>
  );
};

export const wizardV2Routes = [
  {
    path: '/damage-assessments/:id/wizard-v2',
    element: <WizardV2Entry />,
  },
];

export default WizardV2Entry;
