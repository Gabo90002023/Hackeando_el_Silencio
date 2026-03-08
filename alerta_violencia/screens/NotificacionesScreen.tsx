import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { alertasEjemplo } from '../data/alertas';
import { Alerta } from '../types/alerta';

type NotificacionesScreenProps = {
  onBackToPanel: () => void;
};

function obtenerColorNivel(nivel: Alerta['nivel']) {
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

function obtenerColorEstado(estado: Alerta['estado']) {
  switch (estado) {
    case 'Pendiente':
      return '#EF4444';
    case 'En revisión':
      return '#F59E0B';
    case 'Atendida':
      return '#22C55E';
    default:
      return '#64748B';
  }
}

export function NotificacionesScreen({ onBackToPanel }: NotificacionesScreenProps) {
  const total = alertasEjemplo.length;
  const pendientes = alertasEjemplo.filter((item) => item.estado === 'Pendiente').length;

  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.contenedor}>
        <Text style={styles.etiqueta}>Detalle de resultados</Text>
        <Text style={styles.titulo}>Notificaciones del usuario</Text>

        <View style={styles.resumenFila}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenNumero}>{total}</Text>
            <Text style={styles.resumenTexto}>Alertas totales</Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={[styles.resumenNumero, { color: '#EF4444' }]}>{pendientes}</Text>
            <Text style={styles.resumenTexto}>Pendientes</Text>
          </View>
        </View>

        {alertasEjemplo.map((alerta) => (
          <View key={alerta.id} style={styles.tarjeta}>
            <View style={styles.filaTop}>
              <Text style={styles.origen}>{alerta.remitente}</Text>
              <Text style={styles.hora}>{alerta.hora}</Text>
            </View>

            <View style={styles.filaTags}>
              <View style={[styles.tag, { backgroundColor: obtenerColorNivel(alerta.nivel) }]}>
                <Text style={styles.tagTexto}>Riesgo {alerta.nivel}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: obtenerColorEstado(alerta.estado) }]}>
                <Text style={styles.tagTexto}>{alerta.estado}</Text>
              </View>
            </View>

            <Text style={styles.label}>Mensaje detectado</Text>
            <Text style={styles.mensaje}>"{alerta.mensaje}"</Text>

            <Text style={styles.meta}>ID alerta: {alerta.id}</Text>
          </View>
        ))}

        <Text style={styles.volver} onPress={onBackToPanel}>
          Volver al panel
        </Text>
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
    paddingTop: 58,
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
  resumenFila: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  resumenItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  resumenNumero: {
    fontSize: 28,
    color: '#0F172A',
    fontWeight: '800',
  },
  resumenTexto: {
    color: '#475569',
    fontSize: 12,
    marginTop: 4,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  filaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  origen: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  hora: {
    color: '#64748B',
    fontSize: 12,
  },
  filaTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  tag: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 4,
  },
  mensaje: {
    color: '#1E293B',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  meta: {
    color: '#94A3B8',
    fontSize: 11,
  },
  volver: {
    color: '#86EFAC',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
});
