/**
 * Config Plugin para Expo que:
 *  1. Declara el DigitalViolenceService en AndroidManifest.xml
 *  2. Registra el ScreenReaderPackage en MainApplication
 *  3. Copia los archivos Kotlin del módulo al proyecto Android
 *
 * Se ejecuta automáticamente con: npx expo prebuild
 */
const { withAndroidManifest, withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// ─── 1. AndroidManifest: declarar el servicio ────────────────────────────────
const withAccessibilityServiceManifest = (config) => {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const app = manifest.manifest.application[0];

    if (!app.service) app.service = [];

    // Evitar duplicados
    const serviceExists = app.service.some(
      (s) =>
        s.$?.['android:name'] ===
        'expo.modules.screenreader.DigitalViolenceService'
    );

    if (!serviceExists) {
      app.service.push({
        $: {
          'android:name': 'expo.modules.screenreader.DigitalViolenceService',
          'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
          'android:exported': 'true',
          'android:label': '@string/app_name',
        },
        'intent-filter': [
          {
            action: [
              {
                $: {
                  'android:name':
                    'android.accessibilityservice.AccessibilityService',
                },
              },
            ],
          },
        ],
        'meta-data': [
          {
            $: {
              'android:name': 'android.accessibilityservice',
              'android:resource': '@xml/accessibility_service_config',
            },
          },
        ],
      });
    }

    return mod;
  });
};

// ─── 2. build.gradle: asegurar soporte kotlin y srcSet del módulo ─────────────
const withScreenReaderGradle = (config) => {
  return withAppBuildGradle(config, (mod) => {
    const contents = mod.modResults.contents;

    // Agrega el sourceset del módulo si no existe
    const sourceSetEntry = `sourceSets {
        main {
            java.srcDirs += ['../../modules/screen-reader/android/src/main/java']
            res.srcDirs  += ['../../modules/screen-reader/android/src/main/res']
        }
    }`;

    if (!contents.includes('screen-reader/android')) {
      mod.modResults.contents = contents.replace(
        /android\s*\{/,
        `android {\n    ${sourceSetEntry}\n`
      );
    }

    return mod;
  });
};

// ─── 3. MainApplication: registrar ScreenReaderPackage ───────────────────────
const { withMainApplication } = require('@expo/config-plugins');

const withScreenReaderPackage = (config) => {
  return withMainApplication(config, (mod) => {
    let contents = mod.modResults.contents;

    const importLine = 'import expo.modules.screenreader.ScreenReaderPackage';
    if (!contents.includes(importLine)) {
      contents = contents.replace(
        'import expo.modules.ReactNativeHostWrapper',
        `import expo.modules.ReactNativeHostWrapper\n${importLine}`
      );
    }

    if (!contents.includes('ScreenReaderPackage()')) {
      contents = contents.replace(
        /PackageList\(this\)\.packages\.apply\s*\{[^}]*\}/s,
        `PackageList(this).packages.apply {\n              add(ScreenReaderPackage())\n            }`
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });
};

// ─── Plugin principal que combina todos ──────────────────────────────────────
const withAccessibilityService = (config) => {
  config = withAccessibilityServiceManifest(config);
  config = withScreenReaderGradle(config);
  config = withScreenReaderPackage(config);
  return config;
};

module.exports = withAccessibilityService;
