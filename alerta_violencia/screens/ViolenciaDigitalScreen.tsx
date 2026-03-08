import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type ViolenciaDigitalScreenProps = {
  onBackToPanel: () => void;
};

export function ViolenciaDigitalScreen({ onBackToPanel }: ViolenciaDigitalScreenProps) {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.contenedor}>
        <Text style={styles.etiqueta}>Informacion clave</Text>
        <Text style={styles.titulo}>Violencia digital</Text>

        <Image
          source={require('../assets/slide2.png')}
          style={styles.imagen}
          resizeMode="contain"
        />

        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>Que es?</Text>
          <Text style={styles.texto}>
            Es cualquier agresion, amenaza, control o humillacion ejercida por medios digitales
            como chats, redes sociales, correo o plataformas de mensajeria.
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>Senales frecuentes</Text>
          <Text style={styles.texto}>
            Incluye chantaje emocional, insultos repetidos, vigilancia constante, aislamiento,
            amenazas y difusion de contenido para intimidar.
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>Por que es importante detectarla?</Text>
          <Text style={styles.texto}>
            Porque puede escalar rapidamente y afectar seguridad, salud mental y entorno social.
            Detectar patrones tempranos permite activar apoyo y proteccion.
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
  tarjeta: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
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
    color: '#CBD5E1',
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
