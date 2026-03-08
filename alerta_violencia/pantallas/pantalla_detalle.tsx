import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, Alerta } from '../navigation/AppNavigator';

type RutaDetalle = RouteProp<RootStackParamList, 'DetalleAlerta'>;

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

export default function Pantalla_detalle() {
  const route = useRoute<RutaDetalle>();
  const { alerta } = route.params;

  const alPresionarAtendida = () => {
    Alert.alert('Acción', 'La alerta fue marcada como atendida.');
  };

  const alPresionarEnviar = () => {
    Alert.alert('Acción', 'Aquí puedes conectar el envío a un contacto de confianza.');
  };

  const alPresionarRecomendaciones = () => {
    Alert.alert(
      'Recomendaciones',
      'Guardar evidencia, no responder bajo presión, bloquear al remitente si es necesario y contactar a una persona de confianza.'
    );
  };

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={estilos.contenedor}>
        <Text style={estilos.titulo}>Detalle de alerta</Text>
        <Text style={estilos.subtitulo}>
          Información detallada del mensaje detectado
        </Text>

        <View style={estilos.tarjeta}>
          <Text style={estilos.label}>Aplicación de origen</Text>
          <Text style={estilos.valor}>{alerta.remitente}</Text>

          <Text style={estilos.label}>Fecha y hora</Text>
          <Text style={estilos.valor}>
            {alerta.fecha} - {alerta.hora}
          </Text>
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

        <View style={estilos.tarjeta}>
          <Text style={estilos.label}>Mensaje detectado</Text>
          <Text style={estilos.mensaje}>"{alerta.mensaje}"</Text>
        </View>

        <View style={estilos.tarjeta}>
          <Text style={estilos.label}>Motivo de detección</Text>
          <Text style={estilos.valorTexto}>{alerta.motivo}</Text>
        </View>

        <View style={estilos.tarjeta}>
          <Text style={estilos.label}>Palabras o frases detectadas</Text>
          <View style={estilos.contenedorChips}>
            {alerta.palabrasClave.map((palabra, indice) => (
              <View key={indice} style={estilos.chip}>
                <Text style={estilos.chipTexto}>{palabra}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={estilos.tarjeta}>
          <Text style={estilos.label}>Recomendación</Text>
          <Text style={estilos.valorTexto}>{alerta.recomendacion}</Text>
        </View>

        <View style={estilos.contenedorBotones}>
          <TouchableOpacity style={estilos.botonPrimario} onPress={alPresionarAtendida}>
            <Text style={estilos.textoBotonPrimario}>Marcar como atendida</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botonSecundario} onPress={alPresionarEnviar}>
            <Text style={estilos.textoBotonSecundario}>Enviar alerta a contacto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botonTerciario} onPress={alPresionarRecomendaciones}>
            <Text style={estilos.textoBotonTerciario}>Ver recomendaciones</Text>
          </TouchableOpacity>
        </View>
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
  titulo: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 20,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  valorTexto: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  mensaje: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  filaEtiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
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
  contenedorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipTexto: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  contenedorBotones: {
    marginTop: 10,
    gap: 10,
  },
  botonPrimario: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  textoBotonPrimario: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botonSecundario: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  textoBotonSecundario: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botonTerciario: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  textoBotonTerciario: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});