import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/Layout';
import Dashboard from '@/pages/Dashboard';
import CarDetails from '@/pages/CarDetails';
import NewDiagnosis from '@/pages/NewDiagnosis';
import DiagnosisQuestions from '@/pages/DiagnosisQuestions';
import Login from '@/pages/Login';
import VerifyMagicLink from '@/pages/VerifyMagicLink';
import Settings from '@/pages/Settings';
import Diagnoses from '@/pages/Diagnoses';
import Vehicles from '@/pages/Vehicles';
import PreliminaryDiagnosis from '@/pages/PreliminaryDiagnosis';
import FinalReport from '@/pages/FinalReport';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFound from '@/pages/NotFound';
import AiEvaluations from '@/pages/AiEvaluations';
import AiEvaluationDetails from '@/pages/AiEvaluationDetails';
import PromptManager from '@/pages/PromptManager';
import PromptDetail from '@/pages/PromptDetails';
import Metrics from '@/pages/Metrics';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        ),
      },
      {
        path: '/cars',
        element: (
          <ErrorBoundary>
            <Vehicles />
          </ErrorBoundary>
        ),
      },
      {
        path: '/diagnoses',
        element: (
          <ErrorBoundary>
            <Diagnoses />
          </ErrorBoundary>
        ),
      },
      {
        path: '/metrics',
        element: (
          <ErrorBoundary>
            <Metrics />
          </ErrorBoundary>
        ),
      },
      {
        path: '/audits/evaluations',
        element: (
          <ErrorBoundary>
            <AiEvaluations />
          </ErrorBoundary>
        ),
      },
      {
        path: '/prompts',
        element: (
          <ErrorBoundary>
            <PromptManager />
          </ErrorBoundary>
        ),
      },
    ],
  },
  {
    path: '/cars/:carId/diagnosis/:diagnosisId/final-report',
    element: (
      <ErrorBoundary>
        <FinalReport />
      </ErrorBoundary>
    ),
  },
  {
    path: '/cars/:carId/diagnosis/:diagnosisId/questions',
    element: (
      <ErrorBoundary>
        <DiagnosisQuestions />
      </ErrorBoundary>
    ),
  },
  {
    path: '/cars/:carId/diagnosis/:diagnosisId/preliminary-report',
    element: (
      <ErrorBoundary>
        <PreliminaryDiagnosis />
      </ErrorBoundary>
    ),
  },
  {
    path: '/cars/:carId/new-diagnosis',
    element: (
      <ErrorBoundary>
        <NewDiagnosis />
      </ErrorBoundary>
    ),
  },
  {
    path: '/cars/:carId',
    element: (
      <ErrorBoundary>
        <CarDetails />
      </ErrorBoundary>
    ),
  },
  {
    path: '/prompts/:phase',
    element: (
      <ErrorBoundary>
        <PromptDetail />
      </ErrorBoundary>
    ),
  },
  {
    path: '/audits/evaluations/:evaluationId',
    element: (
      <ErrorBoundary>
        <AiEvaluationDetails />
      </ErrorBoundary>
    ),
  },
  {
    path: '/settings',
    element: (
      <ErrorBoundary>
        <Settings />
      </ErrorBoundary>
    ),
  },
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        <Login />
      </ErrorBoundary>
    ),
  },
  {
    path: '/login/verify',
    element: (
      <ErrorBoundary>
        <VerifyMagicLink />
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
  },
]);

export default router;
