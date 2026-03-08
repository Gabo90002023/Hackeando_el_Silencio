import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type HomeScreenProps = {
  onStart: () => void;
};

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <View style={styles.inicioContenedor}>
        <View style={styles.inicioTarjeta}>
          <Text style={styles.inicioEtiqueta}>Sistema preventivo</Text>
          <Text style={styles.inicioTitulo}>Hackeando el Silencio</Text>
          <Text style={styles.inicioTexto}>
            Plataforma de deteccion temprana para visualizar alertas y dar seguimiento a
            mensajes con riesgo de violencia.
          </Text>

          <Pressable style={styles.botonPrincipal} onPress={onStart}>
            <Text style={styles.botonPrincipalTexto}>Comenzar monitoreo</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  inicioContenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inicioTarjeta: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  inicioEtiqueta: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  inicioTitulo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inicioTexto: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  botonPrincipal: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botonPrincipalTexto: {
    color: '#052E16',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
