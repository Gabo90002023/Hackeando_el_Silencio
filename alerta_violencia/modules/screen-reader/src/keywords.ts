export type SeverityLevel = "CRITICO" | "ALTO" | "MEDIO" | "BAJO";

export interface KeywordMatch {
  keyword: string;
  category: string;
  severity: SeverityLevel;
}

export interface DetectionResult {
  detected: boolean;
  matches: KeywordMatch[];
  rawText: string;
  appPackage: string;
  timestamp: number;
  severity: SeverityLevel | null;
}

// ─── AMENAZAS DIRECTAS (CRÍTICO) ─────────────────────────────────────────────
const AMENAZAS_DIRECTAS: string[] = [
  "te voy a matar",
  "te voy a golpear",
  "te voy a lastimar",
  "te voy a hacer daño",
  "vas a morir",
  "te voy a violar",
  "te voy a encontrar",
  "voy a ir a tu casa",
  "conozco donde vives",
  "ya sé dónde estás",
  "te voy a destruir",
  "no vas a salir viva",
  "no vas a salir vivo",
  "te voy a acabar",
  "eres muerta",
  "eres muerto",
  "te mato",
  "te rompo",
  "te pego",
  "te quemo",
  "haré que te arrepientas",
];

// ─── VIOLENCIA DE GÉNERO (CRÍTICO) ────────────────────────────────────────────
const VIOLENCIA_GENERO: string[] = [
  "eres mía",
  "eres mío",
  "te prohíbo",
  "no te voy a dejar ir",
  "sin mí no eres nada",
  "nadie te va a querer",
  "si no estás conmigo no estás con nadie",
  "mírate nada más",
  "eres una cualquiera",
  "eres una zorra",
  "eres un puto",
  "te mereces esto",
  "te lo buscaste",
  "tú tienes la culpa",
  "provócame",
  "obedece",
  "haz lo que te digo",
  "cuando yo diga",
];

// ─── ACOSO Y HUMILLACIÓN (ALTO) ───────────────────────────────────────────────
const ACOSO_HUMILLACION: string[] = [
  "eres estúpida",
  "eres estúpido",
  "eres idiota",
  "eres imbécil",
  "no sirves para nada",
  "no vales nada",
  "eres una basura",
  "eres un inútil",
  "eres una inútil",
  "te odio",
  "desaparece",
  "lárgate",
  "nadie te quiere",
  "todo el mundo te odia",
  "eres una vergüenza",
  "qué asco me das",
  "eres una mentirosa",
  "eres un mentiroso",
  "siempre arruinas todo",
  "eres un fracaso",
  "eres una fracasada",
  "todos se ríen de ti",
  "eres ridícula",
  "eres ridículo",
];

// ─── EXTORSIÓN Y MANIPULACIÓN (ALTO) ─────────────────────────────────────────
const EXTORSION_MANIPULACION: string[] = [
  "si no lo haces",
  "o lo haces o",
  "si me dejas te arrepentirás",
  "voy a publicar tus fotos",
  "tengo tus fotos íntimas",
  "tengo tus videos",
  "voy a compartir todo",
  "le voy a decir a todos",
  "me debes",
  "haz lo que te digo o",
  "si no obedeces",
];

// ─── CIBERACOSO GENERAL (MEDIO) ───────────────────────────────────────────────
const CIBERACOSO_GENERAL: string[] = [
  "fea",
  "gordo",
  "gorda",
  "inútil",
  "idiota",
  "imbécil",
  "tarado",
  "tarada",
  "payaso",
  "payasa",
  "memo",
  "tonta",
  "tonto",
  "bruta",
  "bruto",
  "animal",
  "bestia",
  "basura",
  "porquería",
  "miserable",
  "desgraciado",
  "desgraciada",
  "maldito",
  "maldita",
];

// ─── AUTO-DAÑO (CRÍTICO — requiere intervención) ──────────────────────────────
const AUTO_DANO: string[] = [
  "quiero morirme",
  "quiero desaparecer",
  "no quiero vivir",
  "mejor muerto",
  "mejor muerta",
  "todo sería mejor sin mí",
  "voy a hacerme daño",
  "me voy a cortar",
  "ya no aguanto más",
  "no tiene sentido seguir",
  "nadie me extrañaría",
];

// ─── MAPA COMPLETO ────────────────────────────────────────────────────────────
export const KEYWORD_MAP: {
  keywords: string[];
  category: string;
  severity: SeverityLevel;
}[] = [
  {
    keywords: AMENAZAS_DIRECTAS,
    category: "AMENAZA_DIRECTA",
    severity: "CRITICO",
  },
  {
    keywords: VIOLENCIA_GENERO,
    category: "VIOLENCIA_GENERO",
    severity: "CRITICO",
  },
  { keywords: AUTO_DANO, category: "AUTO_DANO", severity: "CRITICO" },
  { keywords: EXTORSION_MANIPULACION, category: "EXTORSION", severity: "ALTO" },
  {
    keywords: ACOSO_HUMILLACION,
    category: "ACOSO_HUMILLACION",
    severity: "ALTO",
  },
  { keywords: CIBERACOSO_GENERAL, category: "CIBERACOSO", severity: "MEDIO" },
];

// Prioridad de severidad para comparar
export const SEVERITY_PRIORITY: Record<SeverityLevel, number> = {
  CRITICO: 4,
  ALTO: 3,
  MEDIO: 2,
  BAJO: 1,
};

/**
 * Analiza un texto y retorna todos los matches encontrados.
 */
export function analyzeText(text: string, appPackage: string): DetectionResult {
  const lowered = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const matches: KeywordMatch[] = [];

  for (const group of KEYWORD_MAP) {
    for (const keyword of group.keywords) {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (lowered.includes(normalizedKeyword)) {
        matches.push({
          keyword,
          category: group.category,
          severity: group.severity,
        });
      }
    }
  }

  // Determina la severidad máxima encontrada
  let maxSeverity: SeverityLevel | null = null;
  for (const match of matches) {
    if (
      !maxSeverity ||
      SEVERITY_PRIORITY[match.severity] > SEVERITY_PRIORITY[maxSeverity]
    ) {
      maxSeverity = match.severity;
    }
  }

  return {
    detected: matches.length > 0,
    matches,
    rawText: text,
    appPackage,
    timestamp: Date.now(),
    severity: maxSeverity,
  };
}
