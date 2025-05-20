import { createBrowserRouter, RouteObject } from 'react-router-dom';
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
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import NotFound from '@/pages/NotFound';
import AiEvaluations from '@/pages/AiEvaluations';
import AiEvaluationDetails from '@/pages/AiEvaluationDetails';
import PromptManager from '@/pages/PromptManager';
import PromptDetail from '@/pages/PromptDetails';
import Metrics from '@/pages/Metrics';
import ProtectedRoute from '@/components/organisms/ProtectedRoute';
import AppointmentDiagnosis from '@/pages/AppointmentDiagnosis';

const wrapRoute = (route: RouteObject, withAuth: boolean = false): RouteObject => {
  const wrappedRoute: RouteObject = {
    ...route,
    element: route.element ? (
      <ErrorBoundary>
        {withAuth ? <ProtectedRoute>{route.element}</ProtectedRoute> : route.element}
      </ErrorBoundary>
    ) : undefined,
  };

  if (route.children) {
    wrappedRoute.children = route.children.map((child) => wrapRoute(child, withAuth));
  }

  return wrappedRoute;
};

const wrapRoutes = (routes: RouteObject[], withAuth: boolean = false): RouteObject[] => {
  return routes.map((route) => wrapRoute(route, withAuth));
};

const publicRoutes = wrapRoutes([
  {
    path: '/appointments/:appointmentId/cars/:carId/new-diagnosis',
    element: <AppointmentDiagnosis />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login/verify',
    element: <VerifyMagicLink />,
  },
  {
    path: '/damage-assessments/create',
    element: (
      <ErrorBoundary>
        <DamageAssessmentProvider>
          <CreateDamageAssessment />
        </DamageAssessmentProvider>
      </ErrorBoundary>
    ),
  },
  {
    path: '/damage-assessments/:damageAssessmentId',
    element: (
      <ErrorBoundary>
        <DamageAssessmentProvider>
          <DamageAssessmentDetail />
        </DamageAssessmentProvider>
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const authenticatedRoutes = wrapRoutes(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: '/cars',
          element: <Vehicles />,
        },
        {
          path: '/diagnoses',
          element: <Diagnoses />,
        },
        {
          path: '/metrics',
          element: <Metrics />,
        },
        {
          path: '/audits/evaluations',
          element: <AiEvaluations />,
        },
        {
          path: '/prompts',
          element: <PromptManager />,
        },
      ],
    },
    {
      path: '/cars/:carId/diagnosis/:diagnosisId/final-report',
      element: <FinalReport />,
    },
    {
      path: '/cars/:carId/diagnosis/:diagnosisId/questions',
      element: <DiagnosisQuestions />,
    },
    {
      path: '/cars/:carId/diagnosis/:diagnosisId/preliminary-report',
      element: <PreliminaryDiagnosis />,
    },
    {
      path: '/cars/:carId/new-diagnosis',
      element: <NewDiagnosis />,
    },
    {
      path: '/cars/:carId',
      element: <CarDetails />,
    },
    {
      path: '/prompts/:phase',
      element: <PromptDetail />,
    },
    {
      path: '/audits/evaluations/:evaluationId',
      element: <AiEvaluationDetails />,
    },
    {
      path: '/settings',
      element: <Settings />,
    },
  ],
  true,
);

const router = createBrowserRouter([...publicRoutes, ...authenticatedRoutes]);

export default router;
