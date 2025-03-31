import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  icon?: string;
  variant?: 'contained' | 'outlined';
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedButton = ({
  onPress,
  title,
  loading,
  icon,
  variant = 'contained',
  style,
}: AnimatedButtonProps) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 12 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
  };

  React.useEffect(() => {
    if (loading) {
      rotation.value = withSequence(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        withTiming(0, { duration: 0 })
      );

      const interval = setInterval(() => {
        rotation.value = withSequence(
          withTiming(360, {
            duration: 1000,
            easing: Easing.linear,
          }),
          withTiming(0, { duration: 0 })
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
      ],
    };
  });

  const spinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[
        styles.button,
        variant === 'outlined' ? styles.buttonOutlined : styles.buttonContained,
        animatedStyle,
        style,
      ]}
      disabled={loading}
    >
      {loading ? (
        <Animated.View style={spinnerStyle}>
          <MaterialCommunityIcons
            name="loading"
            size={24}
            color={variant === 'outlined' ? '#075E54' : '#fff'}
          />
        </Animated.View>
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color={variant === 'outlined' ? '#075E54' : '#fff'}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              variant === 'outlined' ? styles.textOutlined : styles.textContained,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContained: {
    backgroundColor: '#075E54',
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#075E54',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContained: {
    color: '#fff',
  },
  textOutlined: {
    color: '#075E54',
  },
  icon: {
    marginRight: 8,
  },
}); 