import React from 'react';
import { MicOff } from 'lucide-react';
import Lottie from 'lottie-react';
import microphoneAnimation from '@/assets/animations/microphone.json';

interface RecordingIndicatorProps {
  hasStartedSpeaking: boolean;
  onStopRecording: () => void;
}

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  hasStartedSpeaking,
  onStopRecording,
}) => {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-center rounded-lg bg-white p-4 shadow-lg">
      <div className="mr-4 h-12 w-12">
        <Lottie
          animationData={microphoneAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="mr-4">
        <p className="text-base font-medium text-gray-900">
          {hasStartedSpeaking ? 'Grabando...' : 'Esperando voz...'}
        </p>
        <p className="text-sm text-gray-500">
          {hasStartedSpeaking
            ? 'Escuchando... Haz click en el botón para detener la grabación.'
            : 'Comienza a hablar.'}
        </p>
      </div>
      <button
        onClick={onStopRecording}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
        aria-label="Detener grabación"
      >
        <MicOff className="h-5 w-5" />
      </button>
    </div>
  );
};
