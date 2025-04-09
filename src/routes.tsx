import { createBrowserRouter } from 'react-router-dom';
import { CarProvider } from '@/context/Car.context';
import { MechanicProvider } from '@/context/Mechanic.context';
import Layout from '@/Layout';
import Dashboard from '@/pages/Dashboard';
import CreateCarDiagnosis from '@/pages/CreateCarDiagnosis';
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
    element: (
      <MechanicProvider>
        <CarProvider>
          <Layout />
        </CarProvider>
      </MechanicProvider>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: '/car/create', element: <CreateCar /> },
      { path: '/car/:carId', element: <CarDetails /> },
      { path: '/car/:carId/create', element: <CreateCarDiagnosis /> },
      {
        path: '/car/:carId/diagnosis/:diagnosisId',
        element: <DiagnosisPage />,
      },
      { path: '/configuration', element: <Configuration /> },
    ],
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/vehicles',
    element: <Vehicles />,
  },
  {
    path: '/diagnoses',
    element: <Diagnoses />,
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
