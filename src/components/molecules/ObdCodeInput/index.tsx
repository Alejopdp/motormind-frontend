import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';

interface OBDCodeInputProps {
  initialCodes?: string[];
  onChange?: (codes: string[]) => void;
  disabled?: boolean;
}

export default function OBDCodeInput({ initialCodes = [], onChange, disabled }: OBDCodeInputProps) {
  const [codes, setCodes] = useState<string[]>(initialCodes);
  const [inputValue, setInputValue] = useState('');

  const isValidOBDCode = (code: string): boolean => {
    // Basic validation: OBD codes typically follow patterns like P0123, B1234, C0123, U1234
    const pattern = /^[PBCU][0-9]{4}$/i;
    return pattern.test(code);
  };

  const addCode = (code: string) => {
    const trimmedCode = code.trim().toUpperCase();

    if (trimmedCode && isValidOBDCode(trimmedCode) && !codes.includes(trimmedCode)) {
      const newCodes = [...codes, trimmedCode];
      setCodes(newCodes);
      if (onChange) onChange(newCodes);
    }

    setInputValue('');
  };

  const removeCode = (codeToRemove: string) => {
    const newCodes = codes.filter((code) => code !== codeToRemove);
    setCodes(newCodes);
    if (onChange) onChange(newCodes);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addCode(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <p className="block text-sm font-medium sm:text-base">
        Códigos OBD Leídos <span className="text-muted font-normal">(Opcional)</span>
      </p>

      <div className="flex min-h-[42px] flex-wrap gap-2 rounded-md border border-gray-300 bg-white p-2">
        {codes.map((code, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 bg-gray-100 px-2 py-1"
          >
            {code}
            <button
              type="button"
              onClick={() => removeCode(code)}
              className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addCode(inputValue)}
          placeholder={codes.length ? '' : 'Ingresa códigos OBD (ej: P0301) y presiona Enter'}
          disabled={disabled}
        />
      </div>

      {!!codes.length && (
        <p className="pl-1 text-xs text-gray-400">
          Ingresa los códigos OBD y presiona Enter, coma o espacio para añadirlos
        </p>
      )}
    </div>
  );
}
