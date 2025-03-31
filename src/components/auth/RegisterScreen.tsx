import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../services/supabase/config';
import type { RegisterCredentials } from '../../types/auth';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AnimatedInput } from './AnimatedInput';
import { AnimatedButton } from './AnimatedButton';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  Layout,
} from 'react-native-reanimated';

export const RegisterScreen = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterCredentials>>({});

  const validateForm = () => {
    const newErrors: Partial<RegisterCredentials> = {};
    
    if (!credentials.name) {
      newErrors.name = 'Nome é obrigatório';
    } else if (credentials.name.length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
    }

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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });

      if (error) throw error;

      // Criar perfil do usuário no banco
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            name: credentials.name,
            email: credentials.email,
          },
        ]);

      if (profileError) throw profileError;

      router.push('/login');
    } catch (err: any) {
      setErrors({
        email: 'Erro ao criar conta. Tente novamente.',
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
                  label="Nome"
                  icon="account-outline"
                  value={credentials.name}
                  onChangeText={(text) => {
                    setCredentials({ ...credentials, name: text });
                    setErrors({ ...errors, name: undefined });
                  }}
                  autoCapitalize="words"
                  error={errors.name}
                />

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
                  title="Criar conta"
                  onPress={handleRegister}
                  loading={loading}
                  icon="account-plus"
                  style={styles.registerButton}
                />

                <AnimatedButton
                  title="Já tem uma conta? Entre aqui"
                  onPress={() => router.push('/login')}
                  variant="outlined"
                  icon="login"
                  style={styles.loginButton}
                />
              </View>
            </Animated.View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
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
  registerButton: {
    marginTop: 24,
  },
  loginButton: {
    marginTop: 12,
  },
}); 