import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
} from 'react-native';
import { estilos } from './estilosApp';
import {
  configurarCanalNotificacionesAndroid,
  escucharNotificaciones,
  enviarNotificacionLocal,
  solicitarPermisosNotificaciones,
} from './servicios/Notificaciones';
import { detectarViolencia } from './servicios/detectorViolencia';

type Alerta = {
  id: number;
  remitente: string;
  hora: string;
  nivel: 'Alto' | 'Medio' | 'Bajo';
  estado: 'Pendiente' | 'En revisión' | 'Atendida';
  mensaje: string;
};

const alertasIniciales: Alerta[] = [
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
];

function obtenerColorNivel(nivel: Alerta['nivel']) {
  switch (nivel) {
    case 'Alto':
      return '#D32F2F';
    case 'Medio':
      return '#F57C00';
    case 'Bajo':
      return '#388E3C';
    default:
      return '#666';
  }
}

function obtenerColorEstado(estado: Alerta['estado']) {
  switch (estado) {
    case 'Pendiente':
      return '#D32F2F';
    case 'En revisión':
      return '#F9A825';
    case 'Atendida':
      return '#2E7D32';
    default:
      return '#666';
  }
}

function obtenerHoraActual() {
  const ahora = new Date();
  return ahora.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function App() {
  const [textoEntrada, setTextoEntrada] = useState('');
  const [alertas, setAlertas] = useState<Alerta[]>(alertasIniciales);

  const totalAlertas = alertas.length;
  const alertasAltas = alertas.filter((item) => item.nivel === 'Alto').length;

  useEffect(() => {
    async function inicializarNotificaciones() {
      await configurarCanalNotificacionesAndroid();
      await solicitarPermisosNotificaciones();
    }

    inicializarNotificaciones();

    const limpiarSuscripciones = escucharNotificaciones();

    return () => {
      limpiarSuscripciones();
    };
  }, []);

  async function analizarTexto() {
    if (!textoEntrada.trim()) return;

    const resultado = detectarViolencia(textoEntrada);

    // si no hay violencia no hace nada
    if (resultado.nivel === 'Sin riesgo') {
      console.log('Mensaje sin riesgo');
      setTextoEntrada('');
      return;
    }

    const nuevaAlerta: Alerta = {
      id: Date.now(),
      remitente: 'Mensaje detectado',
      hora: obtenerHoraActual(),
      nivel: resultado.nivel,
      estado: 'Pendiente',
      mensaje: textoEntrada,
  };

  // agregar alerta a la lista
  setAlertas((alertasPrevias) => [nuevaAlerta, ...alertasPrevias]);

  // lanzar notificación
  await enviarNotificacionLocal(
    `⚠ Riesgo ${resultado.nivel}`,
    textoEntrada
  );

  setTextoEntrada('');
}

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={estilos.contenedor}>
        <View style={estilos.encabezado}>
          <Text style={estilos.titulo}>Sistema de Alerta de Violencia</Text>
          <Text style={estilos.subtitulo}>
            Vista de monitoreo para tercero autorizado
          </Text>
        </View>

        <View style={estilos.tarjetaResumen}>
          <Text style={estilos.tituloResumen}>Resumen general</Text>

          <View style={estilos.filaResumen}>
            <View style={estilos.cajaResumen}>
              <Text style={estilos.numeroResumen}>{totalAlertas}</Text>
              <Text style={estilos.textoResumen}>Alertas detectadas</Text>
            </View>

            <View style={estilos.cajaResumen}>
              <Text style={[estilos.numeroResumen, { color: '#D32F2F' }]}>
                {alertasAltas}
              </Text>
              <Text style={estilos.textoResumen}>Riesgo alto</Text>
            </View>
          </View>

          <Text style={estilos.descripcionResumen}>
            Este panel muestra mensajes con posibles indicios de violencia verbal,
            amenaza, manipulación o agresión psicológica.
          </Text>
        </View>

        <View style={estilos.tarjetaEntrada}>
          <Text style={estilos.tituloEntrada}>Probar análisis de texto</Text>

          <TextInput
            style={estilos.campoTexto}
            placeholder="Escribe o pega aquí un mensaje..."
            placeholderTextColor="#94A3B8"
            multiline
            value={textoEntrada}
            onChangeText={setTextoEntrada}
          />

          <Pressable style={estilos.botonAnalizar} onPress={analizarTexto}>
            <Text style={estilos.textoBoton}>Analizar mensaje</Text>
          </Pressable>
        </View>

        <Text style={estilos.seccionTitulo}>Notificaciones recientes</Text>

        {alertas.map((alerta) => (
          <View key={alerta.id} style={estilos.tarjetaAlerta}>
            <View style={estilos.filaSuperior}>
              <Text style={estilos.origenMensaje}>{alerta.remitente}</Text>
              <Text style={estilos.hora}>{alerta.hora}</Text>
            </View>

            <View style={estilos.filaEtiquetas}>
              <View
                style={[
                  estilos.etiqueta,
                  { backgroundColor: obtenerColorNivel(alerta.nivel) },
                ]}
              >
                <Text style={estilos.etiquetaTexto}>Riesgo {alerta.nivel}</Text>
              </View>

              <View
                style={[
                  estilos.etiqueta,
                  { backgroundColor: obtenerColorEstado(alerta.estado) },
                ]}
              >
                <Text style={estilos.etiquetaTexto}>{alerta.estado}</Text>
              </View>
            </View>

            <Text style={estilos.labelMensaje}>Fragmento detectado</Text>
            <Text style={estilos.mensaje}>"{alerta.mensaje}"</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}