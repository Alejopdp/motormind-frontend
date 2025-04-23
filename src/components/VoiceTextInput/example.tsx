import { useState } from 'react';
import { VoiceTextInput } from './index';

export const VoiceTextInputExample = () => {
  const [text, setText] = useState('');

  const handleVoiceInput = (transcript: string) => {
    console.log('Texto reconocido:', transcript);
  };

  const handleError = (message: string) => {
    console.error('Error:', message);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Ejemplo de VoiceTextInput</h1>
      <div className="max-w-md">
        <VoiceTextInput
          value={text}
          onChange={setText}
          onVoiceInput={handleVoiceInput}
          onError={handleError}
          label="Texto con entrada por voz"
          placeholder="Escribe o habla para completar este campo..."
          language="es-ES"
        />
        <div className="mt-4">
          <h2 className="mb-2 text-lg font-semibold">Texto actual:</h2>
          <p className="rounded-md border border-gray-300 p-4">
            {text || 'Ningún texto ingresado'}
          </p>
        </div>
      </div>
    </div>
  );
};
