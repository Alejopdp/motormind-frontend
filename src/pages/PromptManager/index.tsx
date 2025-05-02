import React from 'react';
import { AlertCircle, FileCode2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { promptService } from '@/service/prompt.service';
import { Button } from '@/components/atoms/Button';
import { PromptCard } from '@/components/molecules/PromptCard';
import Spinner from '@/components/atoms/Spinner';
import { Prompt } from '@/types/prompt';

const PromptManager: React.FC = () => {
  const {
    data: prompts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Prompt[]>({
    queryKey: ['prompts'],
    queryFn: async () => {
      const data = await promptService.getAllPrompts();
      return data;
    },
    staleTime: 60000, // 1 minute
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Cargando prompts..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar los prompts</span>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-grow flex-col">
      <div className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white px-6 py-2 shadow-xs sm:flex-row sm:px-8 sm:py-4 lg:flex-row">
        <div className="lg:w-1/3">
          <h1 className="py-0.5 text-xl font-semibold sm:py-0 lg:text-2xl">Gestor de Prompts</h1>
        </div>
      </div>

      {!!prompts.length && (
        <div className="px-4 py-4 sm:px-8">
          {prompts.map((prompt) => (
            <PromptCard key={prompt._id} prompt={prompt} />
          ))}
        </div>
      )}

      {!prompts.length && (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <FileCode2 className="h-10 w-10 text-gray-500" />
          </div>
          <h3 className="text-muted mb-1 text-lg font-medium">No hay prompts disponibles</h3>
        </div>
      )}
    </div>
  );
};

export default PromptManager;
