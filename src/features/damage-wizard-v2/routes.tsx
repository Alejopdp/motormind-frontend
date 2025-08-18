import { useMemo, useEffect, useState } from 'react';
import { Navigate, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { WizardV2Provider, useWizardV2 } from './context/WizardV2Context';
import { ErrorPage } from './components/ErrorPage';
import {
  isValidAssessmentId,
  isValidStep,
  ERROR_MESSAGES,
  wizardV2Path,
  getStepFromWorkflowStatus,
  type WorkflowStatus,
} from './utils/navigation';
import damageAssessmentApi from '@/service/damageAssessmentApi.service';
import Intake from './pages/Intake';
import Damages from './pages/Damages';
import Operations from './pages/Operations';
import Valuation from './pages/Valuation';
import Finalize from './pages/Finalize';

const WIZARD_V2_ENABLED = import.meta.env.VITE_WIZARD_V2_ENABLED === 'true';

export const WizardV2Entry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<unknown>(null);

  // Cargar datos del assessment
  useEffect(() => {
    // Verificar si el wizard está habilitado
    if (!WIZARD_V2_ENABLED) {
      navigate(`/damage-assessments/${id}`);
      return;
    }

    // Manejar caso especial de preview-id (modo intake) - no hacer nada
    if (id === 'preview-id') {
      setIsLoading(false);
      return;
    }

    // Validar ID
    if (!id || !isValidAssessmentId(id)) {
      setError('INVALID_ID');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const loadAssessmentData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Intentar cargar el assessment completo
        const response = await damageAssessmentApi.getAssessment(id);

        if (!mounted) return;

        setAssessmentData(response);

        // Si no hay step especificado, redirigir al step apropiado según el estado
        const currentStep = searchParams.get('step');
        if (!currentStep) {
          const targetStep = getStepFromWorkflowStatus(
            (response.workflow?.status as WorkflowStatus) || 'detected',
          );
          navigate(wizardV2Path(id, targetStep), { replace: true });
          return;
        }

        // Validar step
        if (!isValidStep(currentStep)) {
          navigate(wizardV2Path(id, 'damages'), { replace: true });
          return;
        }

        setIsLoading(false);
      } catch (error: unknown) {
        if (!mounted) return;

        console.error('Error loading assessment:', error);

        const axiosError = error as { response?: { status: number } };
        if (axiosError?.response?.status === 404) {
          setError('ASSESSMENT_NOT_FOUND');
        } else if (axiosError?.response?.status === 403) {
          setError('UNAUTHORIZED');
        } else {
          setError('UNKNOWN_ERROR');
        }
        setIsLoading(false);
      }
    };

    loadAssessmentData();

    return () => {
      mounted = false;
    };
  }, [id, searchParams, navigate]);

  // Manejar caso especial de preview-id después del useEffect
  if (id === 'preview-id') {
    return (
      <WizardV2Provider>
        <Intake />
      </WizardV2Provider>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Cargando peritaje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorConfig = {
      INVALID_ID: {
        title: 'ID de peritaje inválido',
        message: ERROR_MESSAGES.INVALID_ID,
      },
      ASSESSMENT_NOT_FOUND: {
        title: 'Peritaje no encontrado',
        message: 'El peritaje no existe o fue eliminado.',
      },
      UNAUTHORIZED: {
        title: 'Sin permisos',
        message: 'No tienes permisos para acceder a este peritaje.',
      },
      UNKNOWN_ERROR: {
        title: 'Error al cargar',
        message: ERROR_MESSAGES.ASSESSMENT_NOT_FOUND,
      },
    }[error] || { title: 'Error', message: 'Ha ocurrido un error inesperado.' };

    return (
      <ErrorPage
        title={errorConfig.title}
        message={errorConfig.message}
        onGoBack={() => navigate('/damage-assessments')}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <WizardV2Provider>
      <WizardV2Router assessmentData={assessmentData} />
    </WizardV2Provider>
  );
};

interface WizardV2RouterProps {
  assessmentData?: unknown;
}

const WizardV2Router = ({ assessmentData }: WizardV2RouterProps) => {
  const [params] = useSearchParams();
  const step = params.get('step') || 'damages';
  const { state, dispatch } = useWizardV2();

  // Cargar los datos del assessment en el contexto si están disponibles
  useEffect(() => {
    if (assessmentData) {
      // Establecer el assessmentId si está disponible
      if ((assessmentData as any)._id) {
        dispatch({ type: 'SET_ASSESSMENT_ID', payload: (assessmentData as any)._id });
      }

      // Cargar detectedDamages si están disponibles
      if ((assessmentData as any).detectedDamages) {
        dispatch({ type: 'SET_DETECTED_DAMAGES', payload: assessmentData });
      }

      // Cargar confirmedDamages si están disponibles
      if (
        (assessmentData as any).confirmedDamages &&
        (assessmentData as any).confirmedDamages.length > 0
      ) {
        dispatch({
          type: 'CONFIRM_DAMAGES',
          payload: {
            ids: (assessmentData as any).confirmedDamages.map(
              (d: any) => d._id || `${d.area}-${d.subarea}`,
            ),
            damages: (assessmentData as any).confirmedDamages,
          },
        });
      }

      const workflowStatus = (assessmentData as { workflow?: { status?: string } })?.workflow
        ?.status;
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
