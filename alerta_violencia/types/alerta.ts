export type Alerta = {
  id: number;
  remitente: string;
  hora: string;
  nivel: 'Alto' | 'Medio' | 'Bajo';
  estado: 'Pendiente' | 'En revisión' | 'Atendida';
  mensaje: string;
};
