import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './routes.tsx'
import { CarProvider } from './context/Car.context.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CarProvider>
            <RouterProvider router={router} />
        </CarProvider>
    </StrictMode>
)
