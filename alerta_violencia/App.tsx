import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { AnalisisScreen } from './screens/AnalisisScreen';
import { ComoFuncionaScreen } from './screens/ComoFuncionaScreen';
import { HomeScreen } from './screens/HomeScreen';
import { NivelesRiesgoScreen } from './screens/NivelesRiesgoScreen';
import { NotificacionesScreen } from './screens/NotificacionesScreen';
import { PanelScreen } from './screens/PanelScreen';
import { ProyectoScreen } from './screens/ProyectoScreen';
import { ResultadoScreen } from './screens/ResultadoScreen';
import { ViolenciaDigitalScreen } from './screens/ViolenciaDigitalScreen';
import { ResultadoAnalisis } from './types/analisis';

export default function App() {
  const [pantalla, setPantalla] = useState<
    | 'inicio'
    | 'panel'
    | 'analisis'
    | 'resultado'
    | 'proyecto'
    | 'violencia-digital'
    | 'niveles-riesgo'
    | 'como-funciona'
    | 'notificaciones'
  >('inicio');
  const [resultadoActual, setResultadoActual] = useState<ResultadoAnalisis | null>(null);

  if (pantalla === 'inicio') {
    return (
      <>
        <StatusBar style="light" />
        <HomeScreen onStart={() => setPantalla('panel')} />
      </>
    );
  }

  if (pantalla === 'analisis') {
    return (
      <>
        <StatusBar style="light" />
        <AnalisisScreen
          onBackToPanel={() => setPantalla('panel')}
          onGoHome={() => setPantalla('inicio')}
          onAnalysisComplete={(resultado) => {
            setResultadoActual(resultado);
            setPantalla('resultado');
          }}
        />
      </>
    );
  }

  if (pantalla === 'resultado' && resultadoActual) {
    return (
      <>
        <StatusBar style="light" />
        <ResultadoScreen
          resultado={resultadoActual}
          onBackToAnalisis={() => setPantalla('analisis')}
          onBackToPanel={() => setPantalla('panel')}
        />
      </>
    );
  }

  if (pantalla === 'proyecto') {
    return (
      <>
        <StatusBar style="light" />
        <ProyectoScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  }

  if (pantalla === 'violencia-digital') {
    return (
      <>
        <StatusBar style="light" />
        <ViolenciaDigitalScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  }

  if (pantalla === 'niveles-riesgo') {
    return (
      <>
        <StatusBar style="light" />
        <NivelesRiesgoScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  }

  if (pantalla === 'como-funciona') {
    return (
      <>
        <StatusBar style="light" />
        <ComoFuncionaScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  }

  if (pantalla === 'notificaciones') {
    return (
      <>
        <StatusBar style="light" />
        <NotificacionesScreen onBackToPanel={() => setPantalla('panel')} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <PanelScreen
        onGoHome={() => setPantalla('inicio')}
        onGoAnalisis={() => setPantalla('analisis')}
        onGoProyecto={() => setPantalla('proyecto')}
        onGoViolenciaDigital={() => setPantalla('violencia-digital')}
        onGoNivelesRiesgo={() => setPantalla('niveles-riesgo')}
        onGoComoFunciona={() => setPantalla('como-funciona')}
        onGoNotificaciones={() => setPantalla('notificaciones')}
      />
    </>
  );
}
