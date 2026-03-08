# Permisos y Librerias

**Que hace la app**

Lee el texto visible en pantalla de cualquier app del dispositivo. Solo captura texto, no graba ni almacena nada.

---

**Permiso requerido**

Accesibilidad (AccessibilityService). El usuario debe activarlo manualmente en Ajustes > Accesibilidad > Apps descargadas.

Se usa para leer el contenido visible en pantalla de otras apps en tiempo real.

---

**Librerias usadas**

| Libreria                              | Para que                     |
| ------------------------------------- | ---------------------------- |
| expo / react-native                   | Base de la app               |
| expo-status-bar                       | Barra de estado              |
| AccessibilityService (Android nativo) | Capturar texto de otras apps |

---

**Permisos en AndroidManifest**

```xml
<service
  android:name=".DigitalViolenceService"
  android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
  <intent-filter>
    <action android:name="android.accessibilityservice.AccessibilityService" />
  </intent-filter>
</service>
```

No se usan permisos de camara, microfono, ubicacion, contactos ni internet.

---

**Modulo Kotlin**

Ubicacion: modules/screen-reader/android/

| Archivo                   | Para que                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| DigitalViolenceService.kt | Servicio de accesibilidad. Escucha eventos de pantalla, lee el texto visible y lo envia a JavaScript. Filtra teclados y apps del sistema.  |
| ScreenReaderModule.kt     | Puente entre Android y JavaScript. Expone startMonitoring, stopMonitoring e isAccessibilityServiceEnabled para usarlos desde React Native. |
| ScreenReaderPackage.kt    | Registro del modulo. Necesario para que React Native reconozca ScreenReaderModule.                                                         |

---

**Plugin Expo**

Ubicacion: plugins/withAccessibilityService.js

Se ejecuta automaticamente con npx expo prebuild y hace tres cosas:

1. AndroidManifest: declara el DigitalViolenceService con el permiso BIND_ACCESSIBILITY_SERVICE
2. build.gradle: agrega los archivos Kotlin del modulo al proyecto Android
3. MainApplication: registra el ScreenReaderPackage para que React Native lo cargue

Sin este plugin, regenerar la carpeta android eliminaria toda la configuracion nativa.

---

**Apps ignoradas**

Teclados, sistema (SystemUI), launchers y la propia app no son leidos por el servicio.

---

## Permiso requerido

**Para qué se usa:** leer el contenido en pantalla de otras apps en tiempo real.

## Librerías usadas

| Librería                                | Para qué                     |
| --------------------------------------- | ---------------------------- |
| `expo` / `react-native`                 | Base de la app               |
| `expo-status-bar`                       | Barra de estado              |
| `AccessibilityService` (Android nativo) | Capturar texto de otras apps |

---

## Permisos en AndroidManifest

```xml
<!-- Declaración del servicio de accesibilidad -->
<service
  android:name=".DigitalViolenceService"
  android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
  <intent-filter>
    <action android:name="android.accessibilityservice.AccessibilityService" />
  </intent-filter>
</service>
```

No se usan permisos de cámara, micrófono, ubicación, contactos ni internet.

---

## Módulo Kotlin (`modules/screen-reader/android/`)

Que hace :
| `DigitalViolenceService.kt` | El servicio de accesibilidad. Escucha eventos de pantalla, lee el texto visible y lo envía a JavaScript. Filtra teclados y apps del sistema. |
| `ScreenReaderModule.kt` | Puente entre Android y JavaScript. Expone los métodos `startMonitoring`, `stopMonitoring` e `isAccessibilityServiceEnabled` para usarlos desde React Native. |
| `ScreenReaderPackage.kt` | Registro del módulo. Necesario para que React Native reconozca `ScreenReaderModule`. |

## Plugin Expo (`plugins/withAccessibilityService.js`)

Se ejecuta automáticamente con `npx expo prebuild` y hace tres cosas:

1. **AndroidManifest** — declara el `DigitalViolenceService` con el permiso `BIND_ACCESSIBILITY_SERVICE`
2. **build.gradle** — agrega los archivos Kotlin del módulo al proyecto Android
3. **MainApplication** — registra el `ScreenReaderPackage` para que React Native lo cargue

Sin este plugin, regenerar la carpeta `android/` eliminaría toda la configuración nativa.
