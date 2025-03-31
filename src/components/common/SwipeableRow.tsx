import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Action {
  text: string;
  color: string;
  onPress: () => void;
}

interface SwipeableRowProps {
  children: React.ReactNode;
  leftActions?: Action[];
  rightActions?: Action[];
}

export function SwipeableRow({
  children,
  leftActions = [],
  rightActions = [],
}: SwipeableRowProps) {
  const renderAction = (action: Action, isLeft: boolean) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: withSpring(1),
        },
      ],
    }));

    return (
      <Animated.View
        style={[
          styles.actionContainer,
          { backgroundColor: action.color },
          animatedStyle,
        ]}
      >
        <Text
          variant="bodyMedium"
          style={styles.actionText}
          onPress={action.onPress}
        >
          {action.text}
        </Text>
      </Animated.View>
    );
  };

  const renderLeftActions = () => {
    if (!leftActions.length) return null;
    return (
      <Animated.View style={styles.actionsContainer}>
        {leftActions.map((action, index) => (
          <Animated.View key={index}>
            {renderAction(action, true)}
          </Animated.View>
        ))}
      </Animated.View>
    );
  };

  const renderRightActions = () => {
    if (!rightActions.length) return null;
    return (
      <Animated.View style={styles.actionsContainer}>
        {rightActions.map((action, index) => (
          <Animated.View key={index}>
            {renderAction(action, false)}
          </Animated.View>
        ))}
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        friction={2}
        leftThreshold={30}
        rightThreshold={30}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 