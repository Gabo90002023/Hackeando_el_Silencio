import { Alerta } from '../types/alerta';

export const alertasEjemplo: Alerta[] = [
  {
    id: 1,
    remitente: 'WhatsApp',
    hora: '21:10',
    nivel: 'Alto',
    estado: 'Pendiente',
    mensaje: 'Si no contestas ahora, te voy a buscar donde estés.',
  },
  {
    id: 2,
    remitente: 'Messenger',
    hora: '20:42',
    nivel: 'Medio',
    estado: 'En revisión',
    mensaje: 'Siempre haces lo mismo, no sirves para nada.',
  },
  {
    id: 3,
    remitente: 'SMS',
    hora: '19:58',
    nivel: 'Bajo',
    estado: 'Atendida',
    mensaje: '¿Por qué no respondes? Necesito hablar contigo ya.',
  },
];
