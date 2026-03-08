import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Alerta } from '../types/alerta';
import { alertasEjemplo } from '../data/alertas';

type PanelScreenProps = {
  onGoHome: () => void;
  onGoAnalisis: () => void;
  onGoProyecto: () => void;
  onGoViolenciaDigital: () => void;
  onGoNivelesRiesgo: () => void;
  onGoComoFunciona: () => void;
  onGoNotificaciones: () => void;
};

const slidesInformativos = [
  {
    id: 'slide-1',
    titulo: 'Hackeando el Silencio',
    descripcion:
      'Proyecto orientado a detectar senales de violencia verbal y facilitar una respuesta temprana.',
    imagen: require('../assets/slide1.png'),
  },
  {
    id: 'slide-2',
    titulo: 'Violencia digital',
    descripcion:
      'Incluye amenazas, humillaciones, manipulacion y control a traves de mensajes y redes sociales.',
    imagen: require('../assets/slide2.png'),
  },
  {
    id: 'slide-3',
    titulo: 'Niveles de riesgo',
    descripcion:
      'Las alertas se clasifican en Bajo, Medio y Alto para priorizar intervenciones urgentes.',
    imagen: require('../assets/slide 3.png'),
  },
  {
    id: 'slide-4',
    titulo: 'Como funciona',
    descripcion:
      'Se analiza el lenguaje de los mensajes, se estima riesgo y se muestra un panel de seguimiento.',
    imagen: require('../assets/slide 4.png'),
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

export function PanelScreen({
  onGoHome,
  onGoAnalisis,
  onGoProyecto,
  onGoViolenciaDigital,
  onGoNivelesRiesgo,
  onGoComoFunciona,
  onGoNotificaciones,
}: PanelScreenProps) {
  const [slideActivo, setSlideActivo] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const carruselYRef = useRef(0);
  const anchoSlide = Dimensions.get('window').width - 36;

  function actualizarSlide(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const desplazamientoX = event.nativeEvent.contentOffset.x;
    const indice = Math.round(desplazamientoX / anchoSlide);
    setSlideActivo(indice);
  }

  function irAInformacionClave() {
    setMenuAbierto(false);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(carruselYRef.current - 10, 0),
        animated: true,
      });
    });
  }

  return (
    <SafeAreaView style={styles.areaSegura}>
      <Modal
        transparent
        visible={menuAbierto}
        animationType="fade"
        onRequestClose={() => setMenuAbierto(false)}
      >
        <View style={styles.menuOverlay}>
          <Pressable style={styles.menuFondo} onPress={() => setMenuAbierto(false)} />

          <View style={styles.menuLateral}>
            <Text style={styles.menuTitulo}>Menu</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuAbierto(false);
                onGoHome();
              }}
            >
              <Text style={styles.menuItemTexto}>Inicio</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={irAInformacionClave}>
              <Text style={styles.menuItemTexto}>Informacion clave</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuAbierto(false);
                onGoNotificaciones();
              }}
            >
              <Text style={styles.menuItemTexto}>Notificaciones</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => setMenuAbierto(false)}>
              <Text style={styles.menuItemTexto}>Configuracion</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.contenedor}>
        <View style={styles.cabeceraApp}>
          <Pressable style={styles.logoContenedor} onPress={onGoHome}>
            <View style={styles.logoIcono}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logoImagen}
                resizeMode="cover"
              />
            </View>

            <View>
              <Text style={styles.logoTitulo}>Hackeando el Silencio</Text>
              <Text style={styles.logoSubtitulo}>Sistema de Alerta de Violencia</Text>
            </View>
          </Pressable>

          <Pressable style={styles.menuBoton} onPress={() => setMenuAbierto(true)}>
            <Text style={styles.menuBotonTexto}>⋮</Text>
          </Pressable>
        </View>

        <View
          style={styles.bloqueCarrusel}
          onLayout={(event) => {
            carruselYRef.current = event.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.tituloCarrusel}>Destacado para ti</Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={actualizarSlide}
            contentContainerStyle={styles.contenedorSlides}
          >
            {slidesInformativos.map((slide) => {
              const esSlideProyecto = slide.id === 'slide-1';
              const esSlideViolencia = slide.id === 'slide-2';
              const esSlideRiesgo = slide.id === 'slide-3';
              const esSlideManual = slide.id === 'slide-4';

              const accionSlide = esSlideProyecto
                ? onGoProyecto
                : esSlideViolencia
                  ? onGoViolenciaDigital
                  : esSlideRiesgo
                    ? onGoNivelesRiesgo
                    : esSlideManual
                      ? onGoComoFunciona
                  : undefined;

              const textoHint = esSlideProyecto
                ? 'Toca para conocer el enfoque del proyecto'
                : esSlideViolencia
                  ? 'Toca para saber mas sobre violencia digital'
                  : esSlideRiesgo
                    ? 'Toca para ver la clasificacion de riesgo'
                    : esSlideManual
                      ? 'Toca para ver el manual de uso paso a paso'
                  : null;

              return (
                <Pressable
                  key={slide.id}
                  style={[styles.slide, { width: anchoSlide }]}
                  onPress={accionSlide}
                >
                  <Image source={slide.imagen} style={styles.slideImagen} resizeMode="contain" />
                  <Text style={styles.slideTitulo}>{slide.titulo}</Text>
                  <Text style={styles.slideDescripcion}>{slide.descripcion}</Text>
                  {textoHint ? <Text style={styles.hintSlide}>{textoHint}</Text> : null}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.puntos}>
            {slidesInformativos.map((slide, indice) => (
              <View
                key={slide.id}
                style={[
                  styles.punto,
                  indice === slideActivo ? styles.puntoActivo : undefined,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.bloqueAccionAnalisis}>
          <Pressable style={styles.botonAnalisis} onPress={onGoAnalisis}>
            <Text style={styles.botonAnalisisTexto}>Comenzar analisis</Text>
          </Pressable>
        </View>

        <Text style={styles.seccionTitulo}>Notificaciones recientes</Text>

        {alertasEjemplo.map((alerta) => (
          <View key={alerta.id} style={styles.tarjetaAlerta}>
            <View style={styles.filaSuperior}>
              <Text style={styles.origenMensaje}>{alerta.remitente}</Text>
              <Text style={styles.hora}>{alerta.hora}</Text>
            </View>

            <View style={styles.filaEtiquetas}>
              <View
                style={[
                  styles.etiqueta,
                  { backgroundColor: obtenerColorNivel(alerta.nivel) },
                ]}
              >
                <Text style={styles.etiquetaTexto}>Riesgo {alerta.nivel}</Text>
              </View>

              <View
                style={[
                  styles.etiqueta,
                  { backgroundColor: obtenerColorEstado(alerta.estado) },
                ]}
              >
                <Text style={styles.etiquetaTexto}>{alerta.estado}</Text>
              </View>
            </View>

            <Text style={styles.labelMensaje}>Fragmento detectado</Text>
            <Text style={styles.mensaje}>"{alerta.mensaje}"</Text>
          </View>
        ))}
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
    padding: 18,
    paddingBottom: 30,
  },
  cabeceraApp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  logoContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoIcono: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconoTexto: {
    color: '#052E16',
    fontSize: 14,
    fontWeight: '800',
  },
  logoImagen: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  logoTitulo: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  logoSubtitulo: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  menuBoton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuBotonTexto: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
  },
  bloqueCarrusel: {
    marginBottom: 20,
  },
  tituloCarrusel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contenedorSlides: {
    alignItems: 'center',
  },
  slide: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    minHeight: 310,
    justifyContent: 'center',
  },
  slideImagen: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#0B1220',
  },
  slideTitulo: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slideDescripcion: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
  },
  hintSlide: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  puntos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#475569',
  },
  puntoActivo: {
    width: 20,
    backgroundColor: '#22C55E',
  },
  bloqueAccionAnalisis: {
    marginBottom: 22,
  },
  botonAnalisis: {
    backgroundColor: '#22C55E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botonAnalisisTexto: {
    color: '#052E16',
    fontSize: 15,
    fontWeight: '700',
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
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
    flexDirection: 'row',
  },
  menuFondo: {
    flex: 1,
  },
  menuLateral: {
    width: 240,
    backgroundColor: '#0B1220',
    paddingTop: 70,
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#1F2937',
  },
  menuTitulo: {
    color: '#E2E8F0',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  menuItemTexto: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
});
