/*import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as toxicity from '@tensorflow-models/toxicity';

let modelo: toxicity.ToxicityClassifier | null = null;
let promesaModelo: Promise<toxicity.ToxicityClassifier> | null = null;
let inicializado = false;

export type ResultadoToxicity = {
  etiqueta: string;
  coincidencia: boolean | null;
  probabilidades: number[];
};

export async function inicializarToxicity() {
  if (!inicializado) {
    await tf.ready();
    inicializado = true;
  }

  if (modelo) return modelo;

  if (!promesaModelo) {
    promesaModelo = toxicity.load(0.85);
  }

  modelo = await promesaModelo;
  return modelo;
}

export async function analizarToxicity(texto: string): Promise<ResultadoToxicity[]> {
  if (!texto.trim()) return [];

  const clasificador = await inicializarToxicity();
  const predicciones = await clasificador.classify([texto]);

  return predicciones.map((prediccion) => {
    const resultado = prediccion.results[0];

    return {
      etiqueta: prediccion.label,
      coincidencia: resultado.match,
      probabilidades: resultado.probabilities,
    };
  });
}*/
