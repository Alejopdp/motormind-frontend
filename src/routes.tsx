import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'
import Layout from './Layout'
import CarDetails from './pages/CarDetails/CarDetails'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: '/car/:carId', element: <CarDetails /> },
            //   { path: "*", element: <NotFound /> },
        ],
    },
])

export default router
