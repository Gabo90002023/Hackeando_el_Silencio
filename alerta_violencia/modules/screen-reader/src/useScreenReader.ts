import { useEffect, useState } from 'react';
import { onTextCaptured, startMonitoring, stopMonitoring } from './ScreenReader';

export interface Captura {
  /** Texto leído de la pantalla */
  texto: string;
  /** Nombre corto de la app (ej: "Whatsapp", "Instagram") */
  plataforma: string;
}


export function useScreenReader() {
  const [captura, setCaptura] = useState<Captura>({ texto: '', plataforma: '' });

  useEffect(() => {
    startMonitoring();

    const unsuscribir = onTextCaptured((result) => {
      const plataforma = result.appPackage.split('.').slice(-1)[0]
        .replace(/^(.)/, (c: string) => c.toUpperCase());

      setCaptura({ texto: result.rawText, plataforma });
    });

    return () => {
      unsuscribir();
      stopMonitoring();
    };
  }, []);

  return captura;
}
