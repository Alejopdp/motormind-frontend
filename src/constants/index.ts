/*
 *----- MATRICULA MODERNA (desde 2000) ----------
 * Empieza con exactamente 4 dígitos.
 * Puede haber un espacio opcional entre los números y las letras.
 * Exactamente 3 letras excluyendo A, E, I, O, U, Ñ y Q.
 * Exactamente 3 letras excluyendo A, E, I, O, U, Ñ y Q.
 * Ejemplos: 1234 BCD / 0000XYZ / 9876TRW
 * ----- MATRICULA ANTIGUA (antes del 2000) -----
 * Código provincial (1 a 2 letras)
 * Guión o espacio opcional
 * 1 a 6 dígitos
 * Guión o espacio opcional
 * 1 a 2 letras finales (opcionales)
 * Ejemplos: M-1234-AB / PM-123456 / B-1
 */
export const PLATE_REGEX =
  /^(?:\d{4}\s?[B-DF-HJ-NP-TV-Z]{3}|[A-Z]{1,2}[-\s]?\d{1,6}[-\s]?[A-Z]{0,2})$/;

/*
 * 17 caracteres alfanuméricos
 * Solo letras mayúsculas (excepto I, O y Q)
 * No se permiten espacios, guiones, ni caracteres especiales
 */
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/*
 * 1er carácter: P, B, C, U (Tipo de sistema)
 * 2do carácter: 0, 1, 2, 3 (El 0 y 1 son para códigos genéricos SAE, 2 y 3 para específicos del fabricante)
 * 3er, 4to, y 5to carácter: Hexadecimales (0-9, A-F) que identifican el fallo específico.
 */
export const OBD_CODE_REGEX = /^[PBCU][0-3][0-9A-F]{3}$/;

export const PROBABILITY_LEVELS = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja',
} as const;

export const DIAGNOSIS_STATUS = {
  GUIDED_QUESTIONS: 'GUIDED_QUESTIONS',
  PRELIMINARY: 'PRELIMINARY',
  IN_REPARATION: 'IN_REPARATION',
  REPAIRED: 'REPAIRED',
} as const;

export const STALE_TIME = {
  ONE_MINUTE: 1 * 60 * 1000,
  THREE_MINUTES: 3 * 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
} as const;
