import { useState, useEffect, useRef } from 'react';
import { Mic, Check, X } from 'lucide-react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { enqueueSnackbar } from 'notistack';

import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog';
import { RecordingIndicator } from './RecordingIndicator';

interface VoiceTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceInput?: (transcript: string) => void;
  onError?: (message: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  language?: string;
}

export const VoiceTextInput = ({
  value,
  onChange,
  onVoiceInput,
  onError,
  label,
  placeholder = 'El motor se sobrecalienta en trayectos urbanos y el ventilador del radiador no parece encenderse.',
  className,
  disabled = false,
  language = 'es-ES',
}: VoiceTextInputProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const maxRecordingTimeRef = useRef<number | null>(null);
  const noSpeechTimeoutRef = useRef<number | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable: speechRecognitionMicrophoneAvailable,
  } = useSpeechRecognition({
    commands: [],
  });

  // Actualizar el transcript actual cuando cambia
  useEffect(() => {
    if (transcript) {
      setCurrentTranscript(transcript);
    }
  }, [transcript]);

  // Verificar si el navegador soporta la API de reconocimiento de voz
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      onError?.('Tu navegador no soporta entrada por voz');
    }
  }, [browserSupportsSpeechRecognition, onError]);

  // Verificar si el micrófono está disponible
  useEffect(() => {
    setIsMicrophoneAvailable(speechRecognitionMicrophoneAvailable);
  }, [speechRecognitionMicrophoneAvailable]);

  // Limpiar los timeouts cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (maxRecordingTimeRef.current) {
        window.clearTimeout(maxRecordingTimeRef.current);
      }
      if (noSpeechTimeoutRef.current) {
        window.clearTimeout(noSpeechTimeoutRef.current);
      }
    };
  }, []);

  // Manejar el inicio de la grabación
  const handleStartRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      onError?.('Tu navegador no soporta entrada por voz');
      return;
    }

    if (!isMicrophoneAvailable) {
      onError?.('No se pudo acceder al micrófono. Revisa los permisos del navegador');
      return;
    }

    // Limpiar cualquier temporizador pendiente
    if (maxRecordingTimeRef.current) {
      window.clearTimeout(maxRecordingTimeRef.current);
      maxRecordingTimeRef.current = null;
    }
    if (noSpeechTimeoutRef.current) {
      window.clearTimeout(noSpeechTimeoutRef.current);
      noSpeechTimeoutRef.current = null;
    }

    setHasStartedSpeaking(false);
    setCurrentTranscript('');
    setIsRecording(true);
    resetTranscript();
    isRecordingRef.current = true;

    // Iniciar la grabación
    if (window.speechRecognition) {
      window.speechRecognition.continuous = true;
      window.speechRecognition.interimResults = true;
      window.speechRecognition.lang = language;
      window.speechRecognition.start();
    }

    // Configurar el timeout para detectar si el usuario no habla
    noSpeechTimeoutRef.current = window.setTimeout(() => {
      if (!hasStartedSpeaking) {
        onError?.('No se detectó ninguna voz, intenta nuevamente');
        handleStopRecording();
      }
    }, 8000);

    // Configurar el timeout para el tiempo máximo de grabación
    maxRecordingTimeRef.current = window.setTimeout(() => {
      if (isRecording) {
        handleStopRecording();
      }
    }, 60000);
  };

  // Manejar el final de la grabación
  const handleStopRecording = () => {
    // Limpiar los timeouts
    if (maxRecordingTimeRef.current) {
      window.clearTimeout(maxRecordingTimeRef.current);
      maxRecordingTimeRef.current = null;
    }
    if (noSpeechTimeoutRef.current) {
      window.clearTimeout(noSpeechTimeoutRef.current);
      noSpeechTimeoutRef.current = null;
    }

    // Detener la grabación
    if (window.speechRecognition && isRecordingRef.current) {
      window.speechRecognition.stop();
      isRecordingRef.current = false;
    }

    setIsRecording(false);

    // Si hay texto grabado, mostrar el modal de confirmación
    if (currentTranscript) {
      setIsModalOpen(true);
    }
  };

  // Manejar la confirmación del texto
  const handleConfirmText = () => {
    if (currentTranscript) {
      const newValue = value + (value ? ' ' : '') + currentTranscript;
      onChange(newValue);
      onVoiceInput?.(currentTranscript);
      enqueueSnackbar('Texto insertado desde voz', { variant: 'success' });
    }
    setIsModalOpen(false);
  };

  // Manejar el cierre del modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Manejar el inicio del habla
  const handleSpeechStart = () => {
    setHasStartedSpeaking(true);

    if (noSpeechTimeoutRef.current) {
      window.clearTimeout(noSpeechTimeoutRef.current);
      noSpeechTimeoutRef.current = null;
    }
  };

  // Manejar el resultado del reconocimiento de voz
  const handleSpeechResult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    // Recorrer todos los resultados
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;

      // Si es un resultado final, agregarlo al texto final
      if (result.isFinal) {
        finalTranscript += (finalTranscript ? ' ' : '') + transcript;
      } else {
        // Si es un resultado intermedio, usarlo como texto actual
        interimTranscript = transcript;
      }
    }

    // Combinar el texto final con el intermedio
    const combinedTranscript =
      finalTranscript + (finalTranscript && interimTranscript ? ' ' : '') + interimTranscript;
    setCurrentTranscript(combinedTranscript);
  };

  // Configurar los event listeners para el reconocimiento de voz
  useEffect(() => {
    if (window.speechRecognition) {
      window.speechRecognition.onspeechstart = handleSpeechStart;
      window.speechRecognition.onresult = handleSpeechResult;
      window.speechRecognition.onnomatch = () => {
        // Manejar cuando no hay coincidencias
        console.log('No se pudo reconocer el audio');
      };
    }
  }, [hasStartedSpeaking]);

  // Manejar volver a grabar
  const handleRerecord = () => {
    setCurrentTranscript('');
    setIsModalOpen(false);
    handleStartRecording();
  };

  return (
    <div className={`relative ${className}`}>
      {label && <label className="mb-2 block text-sm font-medium">{label}</label>}
      <div className="relative flex">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[120px] resize-none pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 h-12"
          onClick={handleStartRecording}
          disabled={disabled || !browserSupportsSpeechRecognition || !isMicrophoneAvailable}
        >
          <Mic style={{ width: '20px', height: '20px' }} />
        </Button>
      </div>

      {/* Indicador flotante de grabación */}
      {isRecording && (
        <RecordingIndicator
          hasStartedSpeaking={hasStartedSpeaking}
          onStopRecording={handleStopRecording}
        />
      )}

      {/* Modal de confirmación (solo después de detener la grabación) */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar texto</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 min-h-[10rem] w-full rounded-md border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm">{currentTranscript || 'No se detectó ningún texto'}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleRerecord}>
                <Mic className="mr-2 h-4 w-4" />
                Volver a grabar
              </Button>
              {currentTranscript ? (
                <Button variant="default" onClick={handleConfirmText}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmar
                </Button>
              ) : (
                <Button variant="destructive" onClick={handleModalClose}>
                  <X className="mr-2 h-4 w-4" />
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Extender la interfaz Window para incluir speechRecognition
declare global {
  interface Window {
    speechRecognition: SpeechRecognition | null;
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Inicializar speechRecognition
if (typeof window !== 'undefined') {
  window.speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;
}
