export type NivelRiesgo = 'Alto' | 'Medio' | 'Bajo';

export type ResultadoAnalisis = {
  palabras: number;
  mensajes: number;
  nivel: NivelRiesgo;
  resumen: string;
};
