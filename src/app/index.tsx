import React, { useEffect } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeIn,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const scale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      scale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withDelay(100, withTiming(1, { duration: 200 })),
        withDelay(500, withTiming(0.8, { duration: 200 }, () => {
          runOnJS(router.replace)('/home');
        }))
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Background Shapes */}
      <Image
        source={require('../assets/images/splash-bg.png')}
        style={styles.backgroundShapes}
        resizeMode="cover"
      />

      {/* Logo */}
      <Animated.View 
        entering={FadeIn.duration(300)} 
        style={[styles.logoContainer, logoStyle]}
      >
        <Image
          source={require('../assets/images/whatsapp-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bottom Navigation Bar Background */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <View style={styles.bottomNavIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    left: '50%',
    top: '50%',
    transform: [
      { translateX: -40 },
      { translateY: -40 }
    ],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomNavIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 100,
    opacity: 0.2,
  },
}); 