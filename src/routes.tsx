import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'
import Layout from './Layout'
import CarDetails from './pages/CarDetails/CarDetails'
import CarCreate from './pages/CarCreate/CarCreate'
import DiagnosisPage from './pages/Diagnosis/Diagnosis'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: '/car/:carId', element: <CarDetails /> },
            { path: '/car/:carId/create', element: <CarCreate /> },
            {
                path: '/car/:carId/diagnosis/:diagnosisId',
                element: <DiagnosisPage />,
            },
            //   { path: "*", element: <NotFound /> },
        ],
    },
])

export default router
