import { View, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';

interface AvatarProps {
  size?: number;
  source: ImageSourcePropType;
  online?: boolean;
  onPress?: () => void;
}

export function Avatar({
  size = 40,
  source,
  online,
  onPress,
}: AvatarProps) {
  return (
    <Pressable
      style={[
        styles.container,
        { width: size, height: size },
      ]}
      onPress={onPress}
    >
      <Image
        source={source}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
      {online && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#E0E0E0',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: '#25D366',
    borderWidth: 2,
    borderColor: '#fff',
  },
}); 