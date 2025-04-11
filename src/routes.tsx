import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/Layout';
import Dashboard from '@/pages/Dashboard';
import CarDetails from '@/pages/CarDetails';
import DiagnosisPage from '@/pages/Diagnosis';
import Login from '@/pages/Login';
import VerifyMagicLink from '@/pages/VerifyMagicLink';
import Configuration from '@/pages/Configuration';
import CreateCar from '@/pages/CreateCar';
import Diagnoses from '@/pages/Diagnoses';
import Vehicles from '@/pages/Vehicles';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: '/vehicles',
        element: <Vehicles />,
      },
      {
        path: '/diagnoses',
        element: <Diagnoses />,
      },
    ],
  },
  {
    path: '/car/:carId/diagnosis/:diagnosisId',
    element: <DiagnosisPage />,
  },
  {
    path: '/car/:carId',
    element: <CarDetails />,
  },
  {
    path: '/car/create',
    element: <CreateCar />,
  },
  {
    path: '/configuration',
    element: <Configuration />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login/verify',
    element: <VerifyMagicLink />,
  },
]);

export default router;
