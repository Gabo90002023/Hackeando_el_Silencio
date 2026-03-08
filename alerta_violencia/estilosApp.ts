import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
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
    marginBottom: 18,
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
  tarjetaEntrada: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
  },
  tituloEntrada: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  campoTexto: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  botonAnalizar: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
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