import '@/index.css';
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from '@/routes.tsx';
import { AuthContextProvider } from '@/context/Auth.context';
import { WorkshopContextProvider } from '@/context/Workshop.context';
import { DamageAssessmentProvider } from '@/context/DamageAssessment.context';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <WorkshopContextProvider>
        <DamageAssessmentProvider>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </DamageAssessmentProvider>
      </WorkshopContextProvider>
    </AuthContextProvider>
  </QueryClientProvider>,
);
