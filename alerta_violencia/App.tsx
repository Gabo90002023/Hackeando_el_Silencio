import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  DetectionResult,
  PermissionSetup,
  onTextCaptured,
  startMonitoring,
  stopMonitoring,
  useScreenReader,
} from './modules/screen-reader';

import {
  configurarCanalNotificacionesAndroid,
  escucharNotificaciones,
  enviarNotificacionLocal,
  solicitarPermisosNotificaciones,
} from './servicios/Notificaciones';

import { AnalisisScreen } from './screens/AnalisisScreen';
import { ComoFuncionaScreen } from './screens/ComoFuncionaScreen';
import { HomeScreen } from './screens/HomeScreen';
import { NivelesRiesgoScreen } from './screens/NivelesRiesgoScreen';
import { NotificacionesScreen } from './screens/NotificacionesScreen';
import { PanelScreen } from './screens/PanelScreen';
import { ProyectoScreen } from './screens/ProyectoScreen';
import { ResultadoScreen } from './screens/ResultadoScreen';
import { ViolenciaDigitalScreen } from './screens/ViolenciaDigitalScreen';
import { ResultadoAnalisis } from './types/analisis';

type CapturedText = {
  text: string;
  appPackage: string;
  timestamp: number;
};

type Tab = 'alertas' | 'capturas';

type Pantalla =
  | 'inicio'
  | 'panel'
  | 'analisis'
  | 'resultado'
  | 'proyecto'
  | 'violencia-digital'
  | 'niveles-riesgo'
  | 'como-funciona'
  | 'notificaciones';

type CoincidenciaGroseria = {
  keyword: string;
  category: string;
  severity: string;
};

const palabrasGroseras = [
  'puta',
  'puta madre',
  'basura',
  'basuras',
  'mierda',
  'carajo',
  'idiota',
  'imbecil',
  'imbécil',
  'estupido',
  'estúpido',
  'estupida',
  'estúpida',
  'maldito',
  'maldita',
  'perra',
  'perro',
  'zorra',
  'pendejo',
  'pendeja',
  'hijo de puta',
  'hija de puta',
  'hdp',
];

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function detectarGroserias(texto: string): {
  detectado: boolean;
  matches: CoincidenciaGroseria[];
  severity: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO' | null;
} {
  const textoNormalizado = normalizarTexto(texto);
  const matches: CoincidenciaGroseria[] = [];

  for (const palabra of palabrasGroseras) {
    if (textoNormalizado.includes(normalizarTexto(palabra))) {
      matches.push({
        keyword: palabra,
        category: 'Lenguaje ofensivo',
        severity: 'ALTO',
      });
    }
  }

  if (matches.length === 0) {
    return {
      detectado: false,
      matches: [],
      severity: null,
    };
  }

  const severity =
    matches.length >= 3 ? 'CRITICO' : matches.length >= 2 ? 'ALTO' : 'MEDIO';

  return {
    detectado: true,
    matches,
    severity,
  };
}

function nombreAppDesdePackage(appPackage: string) {
  const ultimaParte = appPackage.split('.').pop() ?? appPackage;
  return ultimaParte.replace(/^(.)/, (c) => c.toUpperCase());
}

function crearClaveTexto(texto: string, appPackage: string) {
  return `${appPackage}::${normalizarTexto(texto)}`;
}

export default function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [capturedTexts, setCapturedTexts] = useState<CapturedText[]>([]);
  const [tab, setTab] = useState<Tab>('capturas');

  const [pantalla, setPantalla] = useState<Pantalla>('inicio');
  const [resultadoActual, setResultadoActual] = useState<ResultadoAnalisis | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const limpiarNotificacionesRef = useRef<(() => void) | null>(null);
  const ultimaClaveNotificadaRef = useRef('');
  const ultimoTiempoNotificacionRef = useRef(0);

  const { texto, plataforma } = useScreenReader();

  useEffect(() => {
    if (!texto) return;
    console.log('APP', `[${plataforma}]\n${texto}`);
  }, [texto, plataforma]);

  useEffect(() => {
    async function inicializarNotificaciones() {
      await configurarCanalNotificacionesAndroid();
      await solicitarPermisosNotificaciones();
    }

    inicializarNotificaciones();
    limpiarNotificacionesRef.current = escucharNotificaciones();

    return () => {
      limpiarNotificacionesRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    startMonitoring();

    unsubscribeRef.current = onTextCaptured(async (result) => {
      setCapturedTexts((prev) =>
        [
          {
            text: result.rawText,
            appPackage: result.appPackage,
            timestamp: result.timestamp,
          },
          ...prev,
        ].slice(0, 80)
      );

      if (result.detected) {
        setDetections((prev) => [result, ...prev].slice(0, 50));
      }

      const analisisGroserias = detectarGroserias(result.rawText);

      if (!analisisGroserias.detectado) return;

      const claveActual = crearClaveTexto(result.rawText, result.appPackage);
      const ahora = Date.now();

      if (claveActual === ultimaClaveNotificadaRef.current) return;
      if (ahora - ultimoTiempoNotificacionRef.current < 5000) return;

      ultimaClaveNotificadaRef.current = claveActual;
      ultimoTiempoNotificacionRef.current = ahora;

      const detectionManual: DetectionResult = {
        rawText: result.rawText,
        appPackage: result.appPackage,
        timestamp: result.timestamp,
        detected: true,
        severity: analisisGroserias.severity,
        matches: analisisGroserias.matches,
      };

      setDetections((prev) => [detectionManual, ...prev].slice(0, 50));

      const nombreApp = nombreAppDesdePackage(result.appPackage);
      const resumenPalabras = analisisGroserias.matches
        .map((item) => item.keyword)
        .slice(0, 3)
        .join(', ');

      await enviarNotificacionLocal(
        `⚠ Lenguaje ofensivo detectado en ${nombreApp}`,
        `Palabras detectadas: ${resumenPalabras}`
      );
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
        onPress={() => setTab('capturas')}
      >
        <Text style={[estilos.tabTexto, tab === 'capturas' && estilos.tabTextoActivo]}>
          📝 Capturas ({capturedTexts.length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[estilos.tabBtn, tab === 'alertas' && estilos.tabBtnActivo]}
        onPress={() => setTab('alertas')}
      >
        <Text style={[estilos.tabTexto, tab === 'alertas' && estilos.tabTextoActivo]}>
          🚨 Alertas ({detections.length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const panelMonitoreo = (
    <>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={estilos.contenedor}>
        <View style={estilos.encabezado}>
          <Text style={estilos.titulo}>Sistema de Alerta de Violencia</Text>
          <Text style={estilos.subtitulo}>
            {permissionGranted
              ? '🟢 Monitoreo activo en tiempo real'
              : '⏳ Esperando permiso de accesibilidad…'}
          </Text>
        </View>

        <View style={estilos.tarjetaResumen}>
          <Text style={estilos.tituloResumen}>Resumen general</Text>

          <View style={estilos.filaResumen}>
            <View style={estilos.cajaResumen}>
              <Text style={[estilos.numeroResumen, { color: '#4CAF50' }]}>
                {capturedTexts.length}
              </Text>
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
    </>
  );

  let contenidoPantalla;

  if (pantalla === 'inicio') {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <HomeScreen onStart={() => setPantalla('panel')} />
      </>
    );
  } else if (pantalla === 'analisis') {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <AnalisisScreen
          onBackToPanel={() => setPantalla('panel')}
          onGoHome={() => setPantalla('inicio')}
          onAnalysisComplete={(resultado) => {
            setResultadoActual(resultado);
            setPantalla('resultado');
          }}
        />
      </>
    );
  } else if (pantalla === 'resultado' && resultadoActual) {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <ResultadoScreen
          resultado={resultadoActual}
          onBackToAnalisis={() => setPantalla('analisis')}
          onBackToPanel={() => setPantalla('panel')}
        />
      </>
    );
  } else if (pantalla === 'proyecto') {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <ProyectoScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  } else if (pantalla === 'violencia-digital') {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <ViolenciaDigitalScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  } else if (pantalla === 'niveles-riesgo') {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <NivelesRiesgoScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  } else if (pantalla === 'como-funciona') {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <ComoFuncionaScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  } else if (pantalla === 'notificaciones') {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <NotificacionesScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  } else {
    contenidoPantalla = (
      <>
        <StatusBar style="light" />
        <PanelScreen
          onGoHome={() => setPantalla('inicio')}
          onGoAnalisis={() => setPantalla('analisis')}
          onGoProyecto={() => setPantalla('proyecto')}
          onGoViolenciaDigital={() => setPantalla('violencia-digital')}
          onGoNivelesRiesgo={() => setPantalla('niveles-riesgo')}
          onGoComoFunciona={() => setPantalla('como-funciona')}
          onGoNotificaciones={() => setPantalla('notificaciones')}
        />
      </>
    );
  }

  if (!permissionGranted) {
    return (
      <PermissionSetup onPermissionGranted={handlePermissionGranted}>
        {contenidoPantalla}
      </PermissionSetup>
    );
  }

  return contenidoPantalla;
}

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
        "{detection.rawText.slice(0, 160)}
        {detection.rawText.length > 160 ? '…' : ''}"
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