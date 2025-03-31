import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay,
  Easing,
  withTiming
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const WhatsAppLogo = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withSpring(1, { damping: 12, stiffness: 100 })
    );
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <MaterialCommunityIcons 
          name="message-text" 
          size={80} 
          color="#25D366" 
        />
      </Animated.View>
      <Animated.View style={textAnimatedStyle}>
        <Text variant="headlineLarge" style={styles.title}>FlashChat</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 