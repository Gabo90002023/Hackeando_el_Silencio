import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ResultadoAnalisis } from '../types/analisis';

type AnalisisScreenProps = {
  onBackToPanel: () => void;
  onGoHome: () => void;
  onAnalysisComplete: (resultado: ResultadoAnalisis) => void;
};

const palabrasRiesgoAlto = ['matar', 'golpear', 'buscarte', 'te voy a', 'amenaza'];
const palabrasRiesgoMedio = ['control', 'humillar', 'insulto', 'manipular', 'no sirves'];

function construirResultado(texto: string): ResultadoAnalisis {
  const textoNormalizado = texto.toLowerCase();
  const palabras = texto
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const mensajes = texto
    .split('\n')
    .map((linea) => linea.trim())
    .filter(Boolean).length;

  const altoDetectado = palabrasRiesgoAlto.some((palabra) => textoNormalizado.includes(palabra));
  const medioDetectado = palabrasRiesgoMedio.some((palabra) => textoNormalizado.includes(palabra));

  if (altoDetectado) {
    return {
      palabras,
      mensajes,
      nivel: 'Alto',
      resumen: 'Se detectaron expresiones de amenaza directa. Requiere revision prioritaria.',
    };
  }

  if (medioDetectado) {
    return {
      palabras,
      mensajes,
      nivel: 'Medio',
      resumen: 'Se identifico lenguaje de control o desvalorizacion. Se recomienda seguimiento.',
    };
  }

  return {
    palabras,
    mensajes,
    nivel: 'Bajo',
    resumen: 'No se detectaron senales criticas en este primer analisis automatico.',
  };
}

export function AnalisisScreen({
  onBackToPanel,
  onGoHome,
  onAnalysisComplete,
}: AnalisisScreenProps) {
  const [chatTexto, setChatTexto] = useState('');
  const [archivoSubido, setArchivoSubido] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const [mostrarGuia, setMostrarGuia] = useState(false);

  const palabras = useMemo(() => {
    return chatTexto
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [chatTexto]);

  const mensajes = useMemo(() => {
    return chatTexto
      .split('\n')
      .map((linea) => linea.trim())
      .filter(Boolean).length;
  }, [chatTexto]);

  function simularSubidaArchivo() {
    setArchivoSubido('chat_exportado_demo.txt');
    setError('');
    Alert.alert(
      'Archivo simulado',
      'Para subida real de archivos, podemos integrar expo-document-picker en el siguiente paso.'
    );
  }

  function borrarEntrada() {
    setChatTexto('');
    setArchivoSubido(null);
    setError('');
  }

  function analizarChat() {
    if (!chatTexto.trim() && !archivoSubido) {
      setError('Agrega texto o sube un archivo antes de analizar.');
      return;
    }

    setError('');
    setAnalizando(true);

    setTimeout(() => {
      const textoBase = chatTexto.trim() || 'contenido importado desde archivo';
      const resultado = construirResultado(textoBase);
      setAnalizando(false);
      onAnalysisComplete(resultado);
    }, 1400);
  }

  return (
    <SafeAreaView style={styles.areaSegura}>
      <Modal transparent visible={mostrarGuia} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCaja}>
            <Text style={styles.modalTitulo}>Que analiza el sistema?</Text>
            <Text style={styles.modalTexto}>
              Se revisan patrones de amenaza, control, humillacion, manipulacion y agresion
              verbal para estimar nivel de riesgo.
            </Text>
            <Pressable style={styles.modalBoton} onPress={() => setMostrarGuia(false)}>
              <Text style={styles.modalBotonTexto}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.contenedor}>
        <View style={styles.encabezadoFila}>
          <View>
            <Text style={styles.logoTitulo}>Hackeando el Silencio</Text>
            <Text style={styles.paso}>Paso 1: Subir chat</Text>
          </View>
          <Pressable style={styles.guiaBoton} onPress={() => setMostrarGuia(true)}>
            <Text style={styles.guiaBotonTexto}>?</Text>
          </Pressable>
        </View>

        <Text style={styles.titulo}>Analisis de violencia digital</Text>

        <TextInput
          multiline
          value={chatTexto}
          onChangeText={setChatTexto}
          style={styles.campoTexto}
          textAlignVertical="top"
          placeholder="Pega aqui el chat que deseas analizar..."
          placeholderTextColor="#64748B"
        />

        <View style={styles.filaAcciones}> 
          <Pressable style={styles.botonSecundario} onPress={simularSubidaArchivo}>
            <Text style={styles.botonSecundarioTexto}>Subir archivo</Text>
          </Pressable>
          <Pressable style={styles.botonLimpieza} onPress={borrarEntrada}>
            <Text style={styles.botonLimpiezaTexto}>Borrar texto</Text>
          </Pressable>
        </View>

        {archivoSubido ? <Text style={styles.archivo}>Archivo: {archivoSubido}</Text> : null}

        <View style={styles.metricas}>
          <Text style={styles.metricaTexto}>Palabras: {palabras}</Text>
          <Text style={styles.metricaTexto}>Mensajes: {mensajes}</Text>
        </View>

        {chatTexto.trim() ? (
          <View style={styles.preview}>
            <Text style={styles.previewTitulo}>Vista previa</Text>
            <Text style={styles.previewTexto}>{chatTexto.slice(0, 260)}</Text>
          </View>
        ) : null}

        <View style={styles.tips}>
          <Text style={styles.tipsTitulo}>Indicaciones</Text>
          <Text style={styles.tipsTexto}>
            Puedes subir un archivo de chat o copiar el texto directamente en el campo superior.
          </Text>
          <Text style={styles.tipsPrivacidad}>
            Tus datos se analizan de forma segura y no se comparten.
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.botonPrincipal, analizando ? styles.botonDeshabilitado : undefined]}
          onPress={analizarChat}
          disabled={analizando}
        >
          {analizando ? (
            <View style={styles.cargandoFila}>
              <ActivityIndicator color="#052E16" />
              <Text style={styles.botonPrincipalTexto}>Analizando...</Text>
            </View>
          ) : (
            <Text style={styles.botonPrincipalTexto}>Analizar chat</Text>
          )}
        </Pressable>

        <View style={styles.navInferior}>
          <Pressable style={styles.linkBoton} onPress={onBackToPanel}>
            <Text style={styles.linkTexto}>Volver al panel</Text>
          </Pressable>
          <Pressable style={styles.linkBoton} onPress={onGoHome}>
            <Text style={styles.linkTexto}>Ir al inicio</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contenedor: {
    padding: 22,
    paddingBottom: 34,
  },
  encabezadoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 8,
  },
  logoTitulo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  paso: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '600',
  },
  guiaBoton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  guiaBotonTexto: {
    color: '#E2E8F0',
    fontWeight: '700',
    fontSize: 16,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 14,
  },
  campoTexto: {
    minHeight: 180,
    maxHeight: 280,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#111827',
    color: '#E2E8F0',
    fontSize: 14,
    padding: 14,
    marginBottom: 12,
  },
  filaAcciones: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  botonLimpieza: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#0B1220',
  },
  botonLimpiezaTexto: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  archivo: {
    color: '#93C5FD',
    fontSize: 13,
    marginBottom: 8,
  },
  metricas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricaTexto: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  preview: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  previewTitulo: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  previewTexto: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },
  tips: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 12,
    marginBottom: 12,
  },
  tipsTitulo: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  tipsTexto: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  tipsPrivacidad: {
    color: '#86EFAC',
    fontSize: 12,
    lineHeight: 18,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 13,
    marginBottom: 10,
  },
  botonPrincipal: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  botonPrincipalTexto: {
    color: '#052E16',
    fontSize: 15,
    fontWeight: '700',
  },
  botonSecundario: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  botonSecundarioTexto: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  cargandoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navInferior: {
    flexDirection: 'row',
    gap: 10,
  },
  linkBoton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  linkTexto: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCaja: {
    backgroundColor: '#0B1220',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 16,
  },
  modalTitulo: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalTexto: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  modalBoton: {
    backgroundColor: '#22C55E',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalBotonTexto: {
    color: '#052E16',
    fontSize: 14,
    fontWeight: '700',
  },
});
