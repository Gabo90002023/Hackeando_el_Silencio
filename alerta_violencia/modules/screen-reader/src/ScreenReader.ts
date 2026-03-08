import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  'El módulo nativo ScreenReader no está disponible.\n' +
  'Asegúrate de haber ejecutado: npx expo prebuild && npx expo run:android';

const ScreenReaderNative =
  Platform.OS === 'android'
    ? NativeModules.ScreenReaderModule ?? null
    : null;

let emitter: NativeEventEmitter | null = null;

if (ScreenReaderNative && Platform.OS === 'android') {
  emitter = new NativeEventEmitter(ScreenReaderNative);
}

export type DetectionResult = {
  rawText: string;
  appPackage: string;
  timestamp: number;
  detected: boolean;
  severity: string | null;
  matches: { keyword: string; category: string; severity: string }[];
};

export type ScreenEventCallback = (result: DetectionResult) => void;

export async function isAccessibilityServiceEnabled(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  if (!ScreenReaderNative) {
    console.warn('[ScreenReader]', LINKING_ERROR);
    return false;
  }
  return ScreenReaderNative.isAccessibilityServiceEnabled();
}

export function openAccessibilitySettings(): void {
  if (Platform.OS !== 'android') return;
  if (!ScreenReaderNative) {
    console.warn('[ScreenReader]', LINKING_ERROR);
    return;
  }
  ScreenReaderNative.openAccessibilitySettings();
}

export function startMonitoring(): void {
  if (Platform.OS !== 'android') return;
  if (!ScreenReaderNative) {
    console.warn('[ScreenReader]', LINKING_ERROR);
    return;
  }
  ScreenReaderNative.startMonitoring();
}

export function stopMonitoring(): void {
  if (Platform.OS !== 'android') return;
  if (!ScreenReaderNative) return;
  ScreenReaderNative.stopMonitoring();
}

export function onTextCaptured(callback: ScreenEventCallback): () => void {
  if (!emitter) {
    console.warn('[ScreenReader] Solo disponible en Android con build nativo.');
    return () => {};
  }

  const subscription = emitter.addListener('onTextCaptured', (payload: {
    text: string;
    appPackage: string;
  }) => {
    const result: DetectionResult = {
      rawText: payload.text,
      appPackage: payload.appPackage,
      timestamp: Date.now(),
      detected: false,
      severity: null,
      matches: [],
    };
    callback(result);
  });

  return () => subscription.remove();
}
