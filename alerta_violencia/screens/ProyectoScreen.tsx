import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type ProyectoScreenProps = {
  onBackToPanel: () => void;
};

export function ProyectoScreen({ onBackToPanel }: ProyectoScreenProps) {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.contenedor}>
        <Text style={styles.etiqueta}>Enfoque del proyecto</Text>
        <Text style={styles.titulo}>Hackeando el Silencio</Text>

        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>A que esta orientado?</Text>
          <Text style={styles.texto}>
            Esta app esta orientada a la deteccion temprana de violencia digital en conversaciones
            de mensajeria, redes sociales y chats privados.
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>Por que esta area?</Text>
          <Text style={styles.texto}>
            La violencia digital suele pasar desapercibida porque inicia con mensajes normalizados
            de control, humillacion o amenaza. Identificar estas senales a tiempo ayuda a prevenir
            escalamiento y activar redes de apoyo.
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>Que busca el sistema?</Text>
          <Text style={styles.texto}>
            Analizar lenguaje, estimar nivel de riesgo y mostrar informacion clara para que la
            persona o un tercero autorizado pueda tomar decisiones de cuidado y acompanamiento.
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
    paddingTop: 48,
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
    marginBottom: 18,
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
