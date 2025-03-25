import { createBrowserRouter } from 'react-router-dom'
import { CarProvider } from './context/Car.context'
import Layout from './Layout'
import CarCreate from './pages/CarCreate/CarCreate'
import CarDetails from './pages/CarDetails/CarDetails'
import DiagnosisPage from './pages/Diagnosis/Diagnosis'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import VerifyMagicLink from './pages/VerifyMagicLink/VerifyMagicLink'
import { MechanicProvider } from './context/Mechanic.context'
import Configuration from './pages/Configuration/Configuration'
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
            { index: true, element: <Home /> },
            { path: '/car/:carId', element: <CarDetails /> },
            { path: '/car/:carId/create', element: <CarCreate /> },
            {
                path: '/car/:carId/diagnosis/:diagnosisId',
                element: <DiagnosisPage />,
            },
            { path: '/configuration', element: <Configuration /> },
            //   { path: "*", element: <NotFound /> },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/login/verify',
        element: <VerifyMagicLink />,
    },
])

export default router
