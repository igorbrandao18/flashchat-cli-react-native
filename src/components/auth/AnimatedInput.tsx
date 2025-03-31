import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TextInputProps } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AnimatedInputProps extends TextInputProps {
  label: string;
  icon: string;
  error?: string;
}

export const AnimatedInput = ({ label, icon, error, ...props }: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useSharedValue(props.value ? 1 : 0);
  const scale = useSharedValue(1);

  const handleFocus = () => {
    setIsFocused(true);
    labelPosition.value = withSpring(1, { damping: 12 });
    scale.value = withSpring(0.98);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!props.value) {
      labelPosition.value = withSpring(0, { damping: 12 });
    }
    scale.value = withSpring(1);
  };

  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(
            labelPosition.value === 1 ? -25 : 0,
            { damping: 12 }
          ),
        },
        {
          scale: withSpring(
            labelPosition.value === 1 ? 0.85 : 1,
            { damping: 12 }
          ),
        },
      ],
      color: interpolateColor(
        labelPosition.value,
        [0, 1],
        ['#666', '#075E54']
      ),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={error ? '#dc3545' : isFocused ? '#075E54' : '#666'}
          style={styles.icon}
        />
        <View style={styles.inputWrapper}>
          <Animated.Text style={[styles.label, labelStyle]}>
            {label}
          </Animated.Text>
          <TextInput
            {...props}
            style={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: '#075E54',
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: '#dc3545',
  },
  icon: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    color: '#333',
    height: 40,
    paddingVertical: 0,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
}); 