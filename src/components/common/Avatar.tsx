import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface AvatarProps {
  size: number;
  source: ImageSourcePropType;
  online?: boolean;
  onPress?: () => void;
}

export const Avatar = ({ size, source, online, onPress }: AvatarProps) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const onlineIndicatorSize = size * 0.25;
  const onlineIndicatorStyle = {
    width: onlineIndicatorSize,
    height: onlineIndicatorSize,
    borderRadius: onlineIndicatorSize / 2,
    borderWidth: onlineIndicatorSize * 0.15,
  };

  const content = (
    <View style={[styles.container, containerStyle]}>
      <Image source={source} style={[styles.image, containerStyle]} />
      {online && <View style={[styles.onlineIndicator, onlineIndicatorStyle]} />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#E1E1E1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CD964',
    borderColor: '#FFFFFF',
  },
}); 