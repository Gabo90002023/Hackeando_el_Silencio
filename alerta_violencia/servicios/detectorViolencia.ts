export type NivelRiesgo = 'Alto' | 'Medio' | 'Bajo' | 'Sin riesgo';

type CategoriaInterna =
  | 'amenaza'
  | 'chantaje'
  | 'control'
  | 'insulto'
  | 'humillacion'
  | 'acoso'
  | 'sexual'
  | 'extorsion';

type CoincidenciaDetectada = {
  frase: string;
  categoria: CategoriaInterna;
  peso: number;
};

export type ResultadoDeteccion = {
  nivel: NivelRiesgo;
  puntaje: number;
  coincidencias: string[];
  detalles: CoincidenciaDetectada[];
};

type BloqueCategoria = {
  categoria: CategoriaInterna;
  pesoBase: number;
  frases: string[];
};

const diccionarioViolencia: BloqueCategoria[] = [
  {
    categoria: 'amenaza',
    pesoBase: 6,
    frases: [
      'te voy a matar',
      'te mataré',
      'te matare',
      'te voy a buscar',
      'te voy a golpear',
      'te voy a pegar',
      'te voy a hacer daño',
      'te voy a romper',
      'vas a ver',
      'te vas a arrepentir',
      'cuidate',
      'cuídate',
      'ya verás',
      'ya veras',
      'donde estes',
      'donde estés',
      'te voy a encontrar',
      'te juro que',
      'no sabes con quien te metes',
      'no sabes con quién te metes',
      'te va a pasar algo',
    ],
  },
  {
    categoria: 'chantaje',
    pesoBase: 7,
    frases: [
      'si no contestas',
      'si no me respondes',
      'si no respondes',
      'si no haces caso',
      'si no vuelves conmigo',
      'si no aceptas',
      'voy a publicar tus fotos',
      'voy a subir tus fotos',
      'voy a mostrar tus fotos',
      'voy a mandar tus fotos',
      'voy a publicar tus chats',
      'voy a mostrar tus chats',
      'si me dejas publico todo',
      'si me bloqueas publico todo',
      'le voy a contar a todos',
      'voy a contarle a tu familia',
    ],
  },
  {
    categoria: 'control',
    pesoBase: 3,
    frases: [
      'por que no respondes',
      'por qué no respondes',
      'respondeme ya',
      'respóndeme ya',
      'contesta ahora',
      'necesito hablar contigo ya',
      'me ignoras',
      'siempre haces lo mismo',
      'manda tu ubicacion',
      'manda tu ubicación',
      'envia tu ubicacion',
      'envía tu ubicación',
      'donde estas',
      'dónde estás',
      'con quien estas',
      'con quién estás',
      'llamame ahora',
      'llámame ahora',
      'no hables con nadie',
      'quiero saber donde estas',
      'quiero saber dónde estás',
    ],
  },
  {
    categoria: 'insulto',
    pesoBase: 3,
    frases: [
      'idiota',
      'estupida',
      'estúpida',
      'estupido',
      'estúpido',
      'imbecil',
      'imbécil',
      'tonta',
      'tonto',
      'tarada',
      'tarado',
      'inutil',
      'inútil',
      'mierda',
      'maldita',
      'maldito',
      'basura',
      'asco',
      'pendeja',
      'pendejo',
      'zorra',
      'perra',
      'pelotuda',
      'pelotudo',
    ],
  },
  {
    categoria: 'humillacion',
    pesoBase: 4,
    frases: [
      'no sirves para nada',
      'eres una basura',
      'te odio',
      'das asco',
      'nadie te quiere',
      'eres un fracaso',
      'das pena',
      'nadie te ama',
      'no vales nada',
      'me averguenzas',
      'me avergüenzas',
      'todos se burlan de ti',
      'eres un error',
      'que vergüenza',
    ],
  },
  {
    categoria: 'acoso',
    pesoBase: 5,
    frases: [
      'te estoy vigilando',
      'te estoy viendo',
      'se donde vives',
      'sé dónde vives',
      'se donde estudias',
      'sé dónde estudias',
      'se donde trabajas',
      'sé dónde trabajas',
      'te estoy esperando',
      'sal ahora',
      'aparece ahora',
    ],
  },
  {
    categoria: 'sexual',
    pesoBase: 6,
    frases: [
      'manda fotos intimas',
      'manda fotos íntimas',
      'manda nudes',
      'manda fotos sin ropa',
      'desnudate',
      'desnúdate',
      'quiero verte desnuda',
      'quiero verte desnudo',
      'manda una foto tuya',
      'haz videollamada desnuda',
      'si no mandas fotos',
    ],
  },
  {
    categoria: 'extorsion',
    pesoBase: 7,
    frases: [
      'si no me pagas',
      'mandame dinero',
      'mándame dinero',
      'si no depositas',
      'te voy a exponer',
      'te voy a arruinar',
      'si no haces lo que te digo',
      'si no obedeces',
    ],
  },
];

function quitarTildes(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizarTexto(texto: string): string {
  return quitarTildes(texto)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function contarApariciones(texto: string, frase: string): number {
  if (!texto || !frase) return 0;
  return texto.split(frase).length - 1;
}

function calcularPesoConRepeticion(
  textoNormalizado: string,
  fraseNormalizada: string,
  pesoBase: number
): number {
  const repeticiones = contarApariciones(textoNormalizado, fraseNormalizada);
  if (repeticiones <= 1) return pesoBase;

  const extra = Math.min((repeticiones - 1) * 2, 6);
  return pesoBase + extra;
}

function calcularBonusPorCombinacion(detalles: CoincidenciaDetectada[]): number {
  const categorias = new Set(detalles.map((item) => item.categoria));
  let bonus = 0;

  if (categorias.has('amenaza') && categorias.has('control')) {
    bonus += 4;
  }

  if (categorias.has('chantaje') && categorias.has('sexual')) {
    bonus += 6;
  }

  if (categorias.has('extorsion') && categorias.has('chantaje')) {
    bonus += 6;
  }

  if (categorias.has('insulto') && categorias.has('humillacion')) {
    bonus += 3;
  }

  if (categorias.has('acoso') && categorias.has('amenaza')) {
    bonus += 5;
  }

  return bonus;
}

function obtenerNivelRiesgo(puntaje: number): NivelRiesgo {
  if (puntaje >= 10) return 'Alto';
  if (puntaje >= 5) return 'Medio';
  if (puntaje >= 1) return 'Bajo';
  return 'Sin riesgo';
}

export function detectarViolencia(texto: string): ResultadoDeteccion {
  const textoNormalizado = normalizarTexto(texto);

  if (!textoNormalizado) {
    return {
      nivel: 'Sin riesgo',
      puntaje: 0,
      coincidencias: [],
      detalles: [],
    };
  }

  const detalles: CoincidenciaDetectada[] = [];

  for (const bloque of diccionarioViolencia) {
    for (const fraseOriginal of bloque.frases) {
      const fraseNormalizada = normalizarTexto(fraseOriginal);

      if (textoNormalizado.includes(fraseNormalizada)) {
        detalles.push({
          frase: fraseOriginal,
          categoria: bloque.categoria,
          peso: calcularPesoConRepeticion(
            textoNormalizado,
            fraseNormalizada,
            bloque.pesoBase
          ),
        });
      }
    }
  }

  let puntaje = detalles.reduce((total, item) => total + item.peso, 0);
  puntaje += calcularBonusPorCombinacion(detalles);

  const coincidencias = [...new Set(detalles.map((item) => item.frase))];
  const nivel = obtenerNivelRiesgo(puntaje);

  return {
    nivel,
    puntaje,
    coincidencias,
    detalles,
  };
}