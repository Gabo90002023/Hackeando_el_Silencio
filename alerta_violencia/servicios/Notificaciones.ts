import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermisosNotificaciones() {
  const { status } = await Notifications.getPermissionsAsync();
  let estadoFinal = status;

  if (status !== 'granted') {
    const permiso = await Notifications.requestPermissionsAsync();
    estadoFinal = permiso.status;
  }

  if (estadoFinal !== 'granted') {
    alert('No se concedieron permisos para notificaciones');
    return false;
  }

  return true;
}

export async function configurarCanalNotificacionesAndroid() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alertas', {
      name: 'Alertas',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}

export function escucharNotificaciones() {
  const suscripcionRecibida =
    Notifications.addNotificationReceivedListener((notificacion) => {
      console.log('Notificación recibida:', notificacion);
    });

  const suscripcionRespuesta =
    Notifications.addNotificationResponseReceivedListener((respuesta) => {
      console.log('Usuario tocó la notificación:', respuesta);
    });

  return () => {
    suscripcionRecibida.remove();
    suscripcionRespuesta.remove();
  };
}

export async function enviarNotificacionLocal(
  titulo: string,
  mensaje: string
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensaje,
      sound: true,
    },
    trigger: null,
  });
}