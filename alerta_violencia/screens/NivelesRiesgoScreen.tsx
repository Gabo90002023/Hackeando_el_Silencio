import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type NivelesRiesgoScreenProps = {
  onBackToPanel: () => void;
};

export function NivelesRiesgoScreen({ onBackToPanel }: NivelesRiesgoScreenProps) {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.contenedor}>
        <Text style={styles.etiqueta}>Clasificacion de riesgo</Text>
        <Text style={styles.titulo}>Niveles de riesgo</Text>

        <Image
          source={require('../assets/slide 3.png')}
          style={styles.imagen}
          resizeMode="contain"
        />

        <View style={styles.tarjetaAlto}>
          <Text style={styles.tituloTarjeta}>Riesgo Alto</Text>
          <Text style={styles.texto}>
            Amenazas directas, intimidacion severa o mensajes que sugieren dano inminente.
            Requiere atencion inmediata y activacion de apoyo.
          </Text>
        </View>

        <View style={styles.tarjetaMedio}>
          <Text style={styles.tituloTarjeta}>Riesgo Medio</Text>
          <Text style={styles.texto}>
            Lenguaje de control, humillacion repetida, chantaje emocional o desvalorizacion
            constante. Se recomienda seguimiento cercano.
          </Text>
        </View>

        <View style={styles.tarjetaBajo}>
          <Text style={styles.tituloTarjeta}>Riesgo Bajo</Text>
          <Text style={styles.texto}>
            Senales iniciales o aisladas sin amenaza directa. Aun asi conviene monitorear para
            detectar escalamiento temprano.
          </Text>
        </View>

        <Pressable style={styles.boton} onPress={onBackToPanel}>
          <Text style={styles.botonTexto}>Volver al panel</Text>
        </Pressable>
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
    padding: 20,
    paddingTop: 44,
    paddingBottom: 36,
  },
  etiqueta: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 14,
  },
  imagen: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    backgroundColor: '#111827',
    marginBottom: 14,
  },
  tarjetaAlto: {
    backgroundColor: '#3B0A0A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#7F1D1D',
    padding: 14,
    marginBottom: 10,
  },
  tarjetaMedio: {
    backgroundColor: '#3B260A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#92400E',
    padding: 14,
    marginBottom: 10,
  },
  tarjetaBajo: {
    backgroundColor: '#052E16',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#166534',
    padding: 14,
    marginBottom: 12,
  },
  tituloTarjeta: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  texto: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 22,
  },
  boton: {
    marginTop: 8,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#052E16',
    fontSize: 15,
    fontWeight: '700',
  },
});
