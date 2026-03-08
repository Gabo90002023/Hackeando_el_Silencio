export type NivelRiesgo = 'Alto' | 'Medio' | 'Bajo' | 'Sin riesgo';

type ResultadoDeteccion = {
  nivel: NivelRiesgo;
  puntaje: number;
  coincidencias: string[];
};

const palabrasAltas = [
  'te voy a matar',
  'te voy a buscar',
  'donde estés',
  'te voy a golpear',
  'te voy a pegar',
  'vas a ver',
  'si no contestas',
  'te vas a arrepentir',
  'te voy a hacer daño',
];

const palabrasMedias = [
  'no sirves para nada',
  'eres una basura',
  'idiota',
  'estúpida',
  'estúpido',
  'imbécil',
  'te odio',
  'das asco',
  'nadie te quiere',
  'eres un fracaso',
];

const palabrasBajas = [
  'por qué no respondes',
  'respóndeme ya',
  'contesta ahora',
  'necesito hablar contigo ya',
  'me ignoras',
  'siempre haces lo mismo',
];

export function detectarViolencia(texto: string): ResultadoDeteccion {
  const textoNormalizado = texto.toLowerCase().trim();

  let puntaje = 0;
  const coincidencias: string[] = [];

  for (const frase of palabrasAltas) {
    if (textoNormalizado.includes(frase)) {
      puntaje += 5;
      coincidencias.push(frase);
    }
  }

  for (const frase of palabrasMedias) {
    if (textoNormalizado.includes(frase)) {
      puntaje += 3;
      coincidencias.push(frase);
    }
  }

  for (const frase of palabrasBajas) {
    if (textoNormalizado.includes(frase)) {
      puntaje += 1;
      coincidencias.push(frase);
    }
  }

  if (puntaje >= 5) {
    return { nivel: 'Alto', puntaje, coincidencias };
  }

  if (puntaje >= 3) {
    return { nivel: 'Medio', puntaje, coincidencias };
  }

  if (puntaje >= 1) {
    return { nivel: 'Bajo', puntaje, coincidencias };
  }

  return { nivel: 'Sin riesgo', puntaje: 0, coincidencias: [] };
}