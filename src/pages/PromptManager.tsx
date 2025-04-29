import React, { useEffect, useState } from 'react';
import { Prompt } from '../types/prompt';
import { promptService } from '../service/prompt.service';
import { PromptCard } from '../components/prompts/PromptCard';
import Spinner from '../components/atoms/Spinner';

export const PromptManager: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await promptService.getAllPrompts();
        setPrompts(data);
      } catch (err) {
        setError('Error al cargar los prompts');
        console.error('Error fetching prompts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Gestor de Prompts</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt._id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
};
