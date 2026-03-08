import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ResultadoAnalisis } from '../types/analisis';

type ResultadoScreenProps = {
  resultado: ResultadoAnalisis;
  onBackToAnalisis: () => void;
  onBackToPanel: () => void;
};

function obtenerColorNivel(nivel: ResultadoAnalisis['nivel']) {
  switch (nivel) {
    case 'Alto':
      return '#EF4444';
    case 'Medio':
      return '#F59E0B';
    case 'Bajo':
      return '#22C55E';
    default:
      return '#64748B';
  }
}

export function ResultadoScreen({
  resultado,
  onBackToAnalisis,
  onBackToPanel,
}: ResultadoScreenProps) {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <View style={styles.contenedor}>
        <Text style={styles.etiqueta}>Paso 2: Resultado</Text>
        <Text style={styles.titulo}>Analisis completado</Text>

        <View style={styles.tarjetaNivel}>
          <Text style={styles.label}>Nivel estimado</Text>
          <Text style={[styles.valorNivel, { color: obtenerColorNivel(resultado.nivel) }]}>
            {resultado.nivel}
          </Text>
          <Text style={styles.resumen}>{resultado.resumen}</Text>
        </View>

        <View style={styles.metricas}>
          <View style={styles.itemMetrica}>
            <Text style={styles.numero}>{resultado.mensajes}</Text>
            <Text style={styles.textoMetrica}>Mensajes</Text>
          </View>
          <View style={styles.itemMetrica}>
            <Text style={styles.numero}>{resultado.palabras}</Text>
            <Text style={styles.textoMetrica}>Palabras</Text>
          </View>
        </View>

        <Pressable style={styles.botonPrincipal} onPress={onBackToAnalisis}>
          <Text style={styles.botonPrincipalTexto}>Analizar otro chat</Text>
        </Pressable>

        <Pressable style={styles.botonSecundario} onPress={onBackToPanel}>
          <Text style={styles.botonSecundarioTexto}>Volver al panel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contenedor: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  etiqueta: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 18,
  },
  tarjetaNivel: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 14,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 6,
  },
  valorNivel: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
  },
  resumen: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 21,
  },
  metricas: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  itemMetrica: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  numero: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
  },
  textoMetrica: {
    color: '#475569',
    fontSize: 13,
    marginTop: 4,
  },
  botonPrincipal: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonPrincipalTexto: {
    color: '#052E16',
    fontSize: 15,
    fontWeight: '700',
  },
  botonSecundario: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 13,
    alignItems: 'center',
  },
  botonSecundarioTexto: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
});
