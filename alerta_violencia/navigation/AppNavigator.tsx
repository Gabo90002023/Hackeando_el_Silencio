import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Pantalla_inicio from '../pantallas/pantalla_inicio';
import Pantalla_detalle from '../pantallas/pantalla_detalle';

export type Alerta = {
  id: number;
  remitente: string;
  fecha: string;
  hora: string;
  nivel: 'Alto' | 'Medio' | 'Bajo';
  estado: 'Pendiente' | 'En revisión' | 'Atendida';
  mensaje: string;
  motivo: string;
  palabrasClave: string[];
  recomendacion: string;
};

export type RootStackParamList = {
  Inicio: undefined;
  DetalleAlerta: { alerta: Alerta };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0F172A',
          },
        }}
      >
        <Stack.Screen
          name="Inicio"
          component={Pantalla_inicio}
          options={{ title: 'Sistema de Alerta' }}
        />
        <Stack.Screen
          name="DetalleAlerta"
          component={Pantalla_detalle}
          options={{ title: 'Detalle de alerta' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}