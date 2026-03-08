import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  DetectionResult,
  PermissionSetup,
  onTextCaptured,
  startMonitoring,
  stopMonitoring,
  useScreenReader,
} from './modules/screen-reader';
import * as toxicity from '@tensorflow-models/toxicity';
import { translate } from '@/api/deepl-trasnlate';

type CapturedText = {
  text: string;
  appPackage: string;
  timestamp: number;
};

type Tab = 'alertas' | 'capturas';

export default function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [capturedTexts, setCapturedTexts] = useState<CapturedText[]>([]);
  const [tab, setTab] = useState<Tab>('capturas');
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Hook para obtener texto y plataforma en tiempo real
  //Deben usar esto para mandar a la libreria que detecta la violencia :V 
  const [text, setText] = useState<string>('');
  const [outputs, setOutputs] = useState<any[]>([]);

  const testText =
    'Malnacido hijo de tu putisima madre espero que si un dia te encuentran muerto sepan que sea por mi y decirte que desde el momento que te conoci me repugnaste hasta las entrañas tus estupidas formas de expresarte son las mas horrendas y asquerosas, al mostrarme como diseccionaste y mataste a esas personas mutiladas me dieron ganas de vomitar sobre tu cara.';

  useEffect(() => {
    const run = async () => {
      try {
        const translated = await translate(text);
        setText(translated);

        const threshold = 0.9;
        const model = await toxicity.load(threshold, [
          'toxicity',
          'severe_toxicity',
          'identity_attack',
          'insult',
          'threat',
          'sexual_explicit',
          'obscene',
        ]);

        const predictions = await model.classify([translated]);
        setOutputs(predictions);
        console.log(predictions);
      } catch (error) {
        console.error('Error en traducción o clasificación:', error);
      }
    };

    run();
  }, [text]);

  const { texto, plataforma } = useScreenReader();
  useEffect(() => {
    if (!texto) return;
    setText(texto);
    console.log("APP", `[${plataforma}]\n${texto}`);
  }, [texto, plataforma]);


  useEffect(() => {
    let prob = 0;
    outputs.forEach((o) => {
      if (o.results[0].match) {
        prob += 1;
      }
    });
    const length = outputs.length;
    if (length/prob <= length/3) {
      console.log('Agresividad baja: ', prob);
    }

    if (length/prob <= length/2) {
      console.log('Agresividad media: ', prob);
    }

    if (length/prob <= length) {
      console.log('Agresividad intensa: ', prob);
    }

  }, [outputs])
  

  // Cuando el permiso es concedido, inicia el monitoreo
  useEffect(() => {
    if (!permissionGranted) return;

    startMonitoring();


    // Suscribe al evento de texto capturado
    unsubscribeRef.current = onTextCaptured((result) => {
      // Siempre guarda el texto capturado en el feed
      setCapturedTexts((prev) => [
        { text: result.rawText, appPackage: result.appPackage, timestamp: result.timestamp },
        ...prev,
      ].slice(0, 80));
      if (!result.detected) return;
      setDetections((prev) => [result, ...prev].slice(0, 50));
    });

    return () => {
      stopMonitoring();
      unsubscribeRef.current?.();
    };
  }, [permissionGranted]);

  const handlePermissionGranted = useCallback(() => {
    setPermissionGranted(true);
  }, []);

  const alertasAltas = detections.filter(
    (d) => d.severity === 'CRITICO' || d.severity === 'ALTO'
  ).length;

  const tabBar = (
    <View style={estilos.tabBar}>
      <TouchableOpacity
        style={[estilos.tabBtn, tab === 'capturas' && estilos.tabBtnActivo]}
        onPress={() => setTab('capturas')}>
        <Text style={[estilos.tabTexto, tab === 'capturas' && estilos.tabTextoActivo]}>
          📝 Capturas ({capturedTexts.length})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[estilos.tabBtn, tab === 'alertas' && estilos.tabBtnActivo]}
        onPress={() => setTab('alertas')}>
        <Text style={[estilos.tabTexto, tab === 'alertas' && estilos.tabTextoActivo]}>
          🚨 Alertas ({detections.length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Aún verificando permiso — renderiza la app normal, el modal aparece encima
  const mainContent = (
    <SafeAreaView style={estilos.areaSegura}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={estilos.contenedor}>
        <View style={estilos.encabezado}>
          <Text style={estilos.titulo}>Sistema de Alerta de Violencia</Text>
          <Text style={estilos.subtitulo}>
            {permissionGranted ? '🟢 Monitoreo activo en tiempo real' : '⏳ Esperando permiso de accesibilidad…'}
          </Text>
        </View>

        <View style={estilos.tarjetaResumen}>
          <Text style={estilos.tituloResumen}>Resumen general</Text>
          <View style={estilos.filaResumen}>
            <View style={estilos.cajaResumen}>
              <Text style={[estilos.numeroResumen, { color: '#4CAF50' }]}>{capturedTexts.length}</Text>
              <Text style={estilos.textoResumen}>Textos capturados</Text>
            </View>
            <View style={estilos.cajaResumen}>
              <Text style={estilos.numeroResumen}>{detections.length}</Text>
              <Text style={estilos.textoResumen}>Alertas detectadas</Text>
            </View>
            <View style={estilos.cajaResumen}>
              <Text style={[estilos.numeroResumen, { color: '#D32F2F' }]}>
                {alertasAltas}
              </Text>
              <Text style={estilos.textoResumen}>Riesgo alto/crítico</Text>
            </View>
          </View>
          <Text style={estilos.descripcionResumen}>
            Detectando mensajes con indicios de amenaza, manipulación, acoso o
            violencia verbal en todas las apps del dispositivo.
          </Text>
        </View>

        {tabBar}

        {tab === 'capturas' && (
          <>
            {capturedTexts.length === 0 && (
              <View style={estilos.sinAlertas}>
                <Text style={estilos.sinAlertasTexto}>
                  Sin textos aún.{'\n'}Usa otras apps y verás el texto aquí.
                </Text>
              </View>
            )}
            {capturedTexts.map((cap, idx) => (
              <CapturaCard key={idx} capture={cap} />
            ))}
          </>
        )}

        {tab === 'alertas' && (
          <>
            {detections.length === 0 && (
              <View style={estilos.sinAlertas}>
                <Text style={estilos.sinAlertasTexto}>
                  Sin detecciones aún.{'\n'}El monitoreo está activo en background.
                </Text>
              </View>
            )}
            {detections.map((det, idx) => (
              <AlertaCard key={idx} detection={det} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  // Si el permiso no está concedido, muestra el modal sobre la app
  if (!permissionGranted) {
    return (
      <PermissionSetup onPermissionGranted={handlePermissionGranted}>
        {mainContent}
      </PermissionSetup>
    );
  }

  return mainContent;
}

// ─── Tarjeta de texto capturado (raw) ────────────────────────────────
function CapturaCard({ capture }: { capture: CapturedText }) {
  const hora = new Date(capture.timestamp).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const appCorta = capture.appPackage.split('.').pop() ?? capture.appPackage;

  return (
    <View style={estilos.tarjetaCaptura}>
      <View style={estilos.filaSuperior}>
        <Text style={estilos.origenMensaje}>{appCorta}</Text>
        <Text style={estilos.hora}>{hora}</Text>
      </View>
      <Text style={estilos.textoCapturado}>{capture.text}</Text>
    </View>
  );
}

// ─── Tarjeta por detección ─────────────────────────────────────────────────
function AlertaCard({ detection }: { detection: DetectionResult }) {
  const hora = new Date(detection.timestamp).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const nivelColor =
    detection.severity === 'CRITICO'
      ? '#D32F2F'
      : detection.severity === 'ALTO'
        ? '#F57C00'
        : detection.severity === 'MEDIO'
          ? '#F9A825'
          : '#388E3C';

  return (
    <View style={estilos.tarjetaAlerta}>
      <View style={estilos.filaSuperior}>
        <Text style={estilos.origenMensaje}>
          {detection.appPackage.split('.').pop() ?? detection.appPackage}
        </Text>
        <Text style={estilos.hora}>{hora}</Text>
      </View>

      <View style={estilos.filaEtiquetas}>
        <View style={[estilos.etiqueta, { backgroundColor: nivelColor }]}>
          <Text style={estilos.etiquetaTexto}>{detection.severity}</Text>
        </View>
        {detection.matches.slice(0, 2).map((m, i) => (
          <View key={i} style={[estilos.etiqueta, { backgroundColor: '#1e293b' }]}>
            <Text style={estilos.etiquetaTexto}>{m.category}</Text>
          </View>
        ))}
      </View>

      <Text style={estilos.labelMensaje}>Fragmento detectado</Text>
      <Text style={estilos.mensaje}>
        "{detection.rawText.slice(0, 160)}{detection.rawText.length > 160 ? '…' : ''}"
      </Text>

      {detection.matches.length > 0 && (
        <>
          <Text style={[estilos.labelMensaje, { marginTop: 8 }]}>
            Palabras/frases agresivas ({detection.matches.length})
          </Text>
          {detection.matches.map((m, i) => (
            <Text key={i} style={estilos.keyword}>
              • "{m.keyword}"
            </Text>
          ))}
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contenedor: {
    padding: 18,
    paddingBottom: 30,
  },
  encabezado: {
    marginTop: 10,
    marginBottom: 20,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  tarjetaResumen: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
  },
  tituloResumen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },
  filaResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  cajaResumen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  numeroResumen: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  textoResumen: {
    marginTop: 6,
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
  },
  descripcionResumen: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  seccionTitulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  tarjetaAlerta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  filaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  origenMensaje: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  hora: {
    fontSize: 13,
    color: '#64748B',
  },
  filaEtiquetas: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  etiqueta: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  etiquetaTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  labelMensaje: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  mensaje: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  sinAlertas: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
  sinAlertasTexto: {
    color: '#64748b',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  keyword: {
    fontSize: 13,
    color: '#ef4444',
    paddingLeft: 8,
    marginBottom: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActivo: {
    backgroundColor: '#334155',
  },
  tabTexto: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextoActivo: {
    color: '#FFFFFF',
  },
  tarjetaCaptura: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  textoCapturado: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 21,
    marginTop: 6,
  },
});