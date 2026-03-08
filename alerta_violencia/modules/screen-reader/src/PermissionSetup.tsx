import React, { useEffect, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  isAccessibilityServiceEnabled,
  openAccessibilitySettings,
} from './ScreenReader';

interface Props {
  onPermissionGranted: () => void;
  children?: React.ReactNode;
}


export default function PermissionSetup({ onPermissionGranted, children }: Props) {
  const [visible, setVisible] = useState(true);
  const [checking, setChecking] = useState(false);
  const [returnedFromSettings, setReturnedFromSettings] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    const enabled = await isAccessibilityServiceEnabled();
    setChecking(false);
    if (enabled) {
      setVisible(false);
      onPermissionGranted();
    }
    return enabled;
  };


  useEffect(() => {
    checkStatus();
  }, []);


  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active' && returnedFromSettings) {
          setReturnedFromSettings(false);
          checkStatus();
        }
      }
    );
    return () => subscription.remove();
  }, [returnedFromSettings]);

  const handleOpenSettings = () => {
    setReturnedFromSettings(true);
    openAccessibilitySettings();
  };

  return (
    <>

      {children}

  
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
     
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🛡️</Text>
            </View>


            <Text style={styles.title}>Permiso necesario</Text>
            <Text style={styles.subtitle}>
              Para detectar violencia digital en todas las apps
            </Text>

    
            <View style={styles.divider} />


            <Text style={styles.description}>
              Esta app necesita el{' '}
              <Text style={styles.highlight}>Servicio de Accesibilidad</Text> para
              leer texto en pantalla y detectar mensajes agresivos en tiempo real.
            </Text>

   
            <View style={styles.stepsContainer}>
              <Step number="1" text='Toca "Ir a Ajustes" abajo' />
              <Step number="2" text='Busca "Alerta Violencia" en la lista' />
              <Step number="3" text="Activa el interruptor" />
              <Step number="4" text="Regresa a esta app" />
            </View>

        
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleOpenSettings}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {checking ? 'Verificando…' : '⚙️  Ir a Ajustes de Accesibilidad'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={checkStatus}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Ya lo activé, continuar →</Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              Solo se pide una vez. No se almacenan datos personales.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}


function Step({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 52 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 20,
  },
  highlight: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  stepsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    color: '#cbd5e1',
    fontSize: 14,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#38bdf8',
    fontWeight: '600',
    fontSize: 14,
  },
  note: {
    fontSize: 11,
    color: '#334155',
    textAlign: 'center',
  },
});

