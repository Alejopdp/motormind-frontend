import React from 'react';
import { LucideProps } from 'lucide-react';

interface ImageUploadOptionButtonProps {
  id: string;
  IconComponent: React.FC<LucideProps>;
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  canUploadMore: boolean; // Para controlar los estilos visuales de habilitado/deshabilitado
  capture?: 'user' | 'environment';
  multiple?: boolean;
}

export const ImageUploadOptionButton: React.FC<ImageUploadOptionButtonProps> = ({
  id,
  IconComponent,
  labelText,
  onChange,
  disabled,
  canUploadMore, // Usar esta prop para los estilos
  capture,
  multiple,
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-gray-50 p-10 text-center ${canUploadMore ? 'border-gray-300 hover:bg-gray-100' : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'}`}
    >
      <IconComponent
        className={`mb-2 h-12 w-12 ${canUploadMore ? 'text-gray-500' : 'text-gray-400'}`}
      />
      <span className={`font-medium ${canUploadMore ? 'text-gray-700' : 'text-gray-400'}`}>
        {labelText}
      </span>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture={capture}
        multiple={multiple}
        onChange={onChange}
        className="hidden"
        disabled={disabled}
      />
    </label>
  );
};
