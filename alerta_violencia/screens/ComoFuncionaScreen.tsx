import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type ComoFuncionaScreenProps = {
  onBackToPanel: () => void;
};

const pasos = [
  {
    numero: 'Paso 1',
    titulo: 'Abrir el modulo de analisis',
    descripcion:
      'Desde el panel principal, presiona el boton "Comenzar analisis" para entrar al formulario.',
  },
  {
    numero: 'Paso 2',
    titulo: 'Ingresar o subir chat',
    descripcion:
      'Pega el chat en el campo de texto o usa la opcion de subir archivo para cargar contenido.',
  },
  {
    numero: 'Paso 3',
    titulo: 'Lanzar analisis',
    descripcion:
      'Pulsa "Analizar chat". El sistema calcula palabras clave, nivel de riesgo y resumen.',
  },
  {
    numero: 'Paso 4',
    titulo: 'Revisar resultado y actuar',
    descripcion:
      'Consulta nivel Alto/Medio/Bajo, lee la recomendacion y vuelve al panel para seguimiento.',
  },
];

export function ComoFuncionaScreen({ onBackToPanel }: ComoFuncionaScreenProps) {
  return (
    <SafeAreaView style={styles.areaSegura}>
      <ScrollView contentContainerStyle={styles.contenedor}>
        <Text style={styles.etiqueta}>Guia de uso</Text>
        <Text style={styles.titulo}>Como funciona la app</Text>

        <Image
          source={require('../assets/slide 4.png')}
          style={styles.imagenCabecera}
          resizeMode="contain"
        />

        <Text style={styles.aclaracion}>
          Manual rapido para ejecutar un analisis de violencia digital de inicio a fin.
        </Text>

        {pasos.map((paso) => (
          <View key={paso.numero} style={styles.tarjetaPaso}>
            <Text style={styles.numeroPaso}>{paso.numero}</Text>
            <Text style={styles.tituloPaso}>{paso.titulo}</Text>
            <Text style={styles.descripcionPaso}>{paso.descripcion}</Text>
          </View>
        ))}

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
  imagenCabecera: {
    width: '100%',
    height: 210,
    borderRadius: 14,
    backgroundColor: '#111827',
    marginBottom: 12,
  },
  aclaracion: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  tarjetaPaso: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 14,
    marginBottom: 12,
  },
  numeroPaso: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tituloPaso: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  descripcionPaso: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
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
