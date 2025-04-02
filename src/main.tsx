import 'bootstrap/dist/css/bootstrap.min.css'
import { SnackbarProvider } from 'notistack'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/Auth.context'
import './index.css'
import router from './routes.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <SnackbarProvider>
            <RouterProvider router={router} />
        </SnackbarProvider>
    </AuthContextProvider>
)
