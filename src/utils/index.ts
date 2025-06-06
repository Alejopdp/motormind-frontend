import { DIAGNOSIS_STATUS } from '@/constants';
import { Diagnosis } from '@/types/Diagnosis';

export const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday) {
    return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};

export const formatToddmmyyyy = (date: Date) => {
  if (!date) return '';
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const parseSpanishDate = (dateString: string): Date | undefined => {
  // Parse date in format DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return undefined;
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
};

export const diagnosisLink = (diagnosis: Diagnosis, back?: boolean) => {
  const mainLink = `/cars/${diagnosis.carId}/diagnosis/${diagnosis._id}`;

  let path = '';

  if (diagnosis.status === DIAGNOSIS_STATUS.GUIDED_QUESTIONS) {
    path = back ? 'questions?back=true' : 'questions';
  } else if (diagnosis.status === DIAGNOSIS_STATUS.PRELIMINARY) {
    path = back ? 'preliminary-report?back=true' : 'preliminary-report';
  } else if (
    diagnosis.status === DIAGNOSIS_STATUS.IN_REPARATION ||
    diagnosis.status === DIAGNOSIS_STATUS.REPAIRED
  ) {
    path = back ? 'final-report?back=true' : 'final-report';
  }

  return `${mainLink}/${path}`;
};
