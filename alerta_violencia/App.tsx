import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type Alerta = {
  id: number;
  remitente: string;
  hora: string;
  nivel: 'Alto' | 'Medio' | 'Bajo';
  estado: 'Pendiente' | 'En revisión' | 'Atendida';
  mensaje: string;
};

const alertasEjemplo: Alerta[] = [
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

export default function App() {
  const totalAlertas = alertasEjemplo.length;
  const alertasAltas = alertasEjemplo.filter((item) => item.nivel === 'Alto').length;

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={estilos.contenedor}>
        <View style={estilos.encabezado}>
          <Text style={estilos.titulo}>Sistema de Alerta de Violencia</Text>
          <Text style={estilos.subtitulo}>Vista de monitoreo para tercero autorizado</Text>
        </View>

        <View style={estilos.tarjetaResumen}>
          <Text style={estilos.tituloResumen}>Resumen general</Text>

          <View style={estilos.filaResumen}>
            <View style={estilos.cajaResumen}>
              <Text style={estilos.numeroResumen}>{totalAlertas}</Text>
              <Text style={estilos.textoResumen}>Alertas detectadas</Text>
            </View>

            <View style={estilos.cajaResumen}>
              <Text style={[estilos.numeroResumen, { color: '#D32F2F' }]}>{alertasAltas}</Text>
              <Text style={estilos.textoResumen}>Riesgo alto</Text>
            </View>
          </View>

          <Text style={estilos.descripcionResumen}>
            Este panel muestra mensajes con posibles indicios de violencia verbal, amenaza,
            manipulación o agresión psicológica.
          </Text>
        </View>

        <Text style={estilos.seccionTitulo}>Notificaciones recientes</Text>

        {alertasEjemplo.map((alerta) => (
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
});