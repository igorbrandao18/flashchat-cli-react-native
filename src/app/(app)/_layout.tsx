import { Stack, usePathname } from 'expo-router';
import { Platform, StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  Layout,
} from 'react-native-reanimated';

// Configurações de animação para as telas
const screenAnimations = {
  customAnimation: {
    entering: (targetRoute: string) => {
      // Animações diferentes baseadas na rota
      if (targetRoute.includes('/chats/')) {
        return FadeInUp.duration(300).springify();
      }
      return FadeInDown.duration(300).springify();
    },
    exiting: (targetRoute: string) => {
      if (targetRoute.includes('/chats/')) {
        return FadeOutDown.duration(300).springify();
      }
      return FadeOutUp.duration(300).springify();
    },
    layout: Layout.springify(),
  },
};

// Configurações de tema e estilo para o header
const headerStyle = {
  backgroundColor: '#075E54',
  borderBottomWidth: 0,
  elevation: 0,
  shadowOpacity: 0,
};

const headerConfig = {
  headerStyle,
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  headerTintColor: '#FFFFFF',
};

interface TabButtonProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, active, onPress }) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      active && styles.activeTabButton
    ]}
    onPress={onPress}
  >
    <MaterialCommunityIcons
      name={icon}
      size={24}
      color={active ? '#075E54' : '#8E8E93'}
    />
    <Text style={[
      styles.tabLabel,
      active && styles.activeTabLabel
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isActive = (route: string) => pathname?.startsWith(route) ?? false;

  return (
    <Animated.View 
      style={{ 
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar 
        barStyle="light-content"
        backgroundColor="#075E54"
        translucent={true}
      />
      
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
          // Configurações personalizadas do header quando necessário
          header: undefined,
          ...headerConfig,
          // Animações personalizadas
          ...screenAnimations,
          // Gestos de navegação
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen 
          name="chats" 
          options={{
            title: 'Conversas',
          }}
        />
        
        <Stack.Screen 
          name="chats/[id]"
          options={{
            title: '',
            presentation: 'card',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />

        <Stack.Screen 
          name="chats/new"
          options={{
            title: 'Nova Conversa',
            presentation: 'modal',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
      </Stack>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TabButton
          icon="message-text-outline"
          label="Conversas"
          active={isActive('/(app)/chats')}
          onPress={() => {}}
        />
        <TabButton
          icon="camera-outline"
          label="Câmera"
          active={isActive('/(app)/camera')}
          onPress={() => {}}
        />
        <TabButton
          icon="image-multiple-outline"
          label="Status"
          active={isActive('/(app)/status')}
          onPress={() => {}}
        />
        <TabButton
          icon="phone-outline"
          label="Chamadas"
          active={isActive('/(app)/calls')}
          onPress={() => {}}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTabButton: {
    borderTopWidth: 2,
    borderTopColor: '#075E54',
    marginTop: -2,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#8E8E93',
  },
  activeTabLabel: {
    color: '#075E54',
  },
}); 