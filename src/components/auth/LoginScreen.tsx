import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import type { LoginCredentials } from '../../types/auth';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AnimatedInput } from './AnimatedInput';
import { AnimatedButton } from './AnimatedButton';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  Layout,
} from 'react-native-reanimated';

export const LoginScreen = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const validateForm = () => {
    const newErrors: Partial<LoginCredentials> = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simular um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navegar direto para a lista de chats
      router.replace('/(app)/chats/');
    } catch (err: any) {
      setErrors({
        password: 'Erro ao fazer login. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            layout={Layout.springify()}
          >
            <WhatsAppLogo />
          </Animated.View>

          <Animated.View 
            style={styles.form}
            entering={FadeInUp.duration(1000).springify().delay(400)}
            layout={Layout.springify()}
          >
            <View style={styles.card}>
              <AnimatedInput
                label="Email"
                icon="email-outline"
                value={credentials.email}
                onChangeText={(text) => {
                  setCredentials({ ...credentials, email: text });
                  setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <AnimatedInput
                label="Senha"
                icon="lock-outline"
                value={credentials.password}
                onChangeText={(text) => {
                  setCredentials({ ...credentials, password: text });
                  setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry
                error={errors.password}
              />

              <AnimatedButton
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                icon="login"
                style={styles.loginButton}
              />

              <AnimatedButton
                title="Criar uma conta"
                onPress={() => router.push('/register')}
                variant="outlined"
                icon="account-plus-outline"
                style={styles.registerButton}
              />
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButton: {
    marginTop: 24,
  },
  registerButton: {
    marginTop: 12,
  },
}); 