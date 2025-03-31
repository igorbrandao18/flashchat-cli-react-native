import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Platform,
  TextInput,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '../../../components/common/Avatar';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Swipeable, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Appbar, FAB, Searchbar, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { ChatListItem } from '../../../components/chat/ChatListItem';
import type { Chat } from '../../../types/chat';

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ChatItemProps {
  chat: Chat & {
    typing?: boolean;
    muted?: boolean;
    pinned?: boolean;
    isVoiceMessage?: boolean;
    voiceDuration?: string;
    isPhoto?: boolean;
    isGroup?: boolean;
    participantsCount?: number;
  };
  onPress: () => void;
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface TabButtonProps {
  icon: IconName;
  label: string;
  active: boolean;
  onPress: () => void;
}

const formatMessageTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // If today
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If this week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
};

// Mock data for chats with more details
const mockChats: ChatItemProps['chat'][] = [
  {
    id: '1',
    name: 'João Silva',
    lastMessage: {
      text: 'Oi, tudo bem?',
      timestamp: new Date(),
      status: 'read'
    },
    unreadCount: 2,
    avatar: 'https://i.pravatar.cc/150?img=1',
    online: true,
    typing: true,
    muted: false,
    pinned: true,
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    lastMessage: {
      text: 'Vamos marcar aquele café?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      status: 'delivered'
    },
    unreadCount: 0,
    avatar: 'https://i.pravatar.cc/150?img=2',
    online: false,
    typing: false,
    muted: true,
    pinned: true,
  },
  {
    id: '3',
    name: 'Pedro Santos',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: {
      text: 'Vou enviar os arquivos hoje ainda',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'read',
    },
    unreadCount: 0,
    online: true,
  },
];

const SwipeableChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => {
  const swipeableRef = useRef<Swipeable>(null);

  const handleArchive = () => {
    swipeableRef.current?.close();
    // TODO: Implement archive functionality
    console.log('Archive chat:', chat.id);
  };

  const handleMore = () => {
    swipeableRef.current?.close();
    // TODO: Implement more options menu
    console.log('More options for chat:', chat.id);
  };

  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <RectButton 
        style={[styles.swipeAction, { backgroundColor: '#008069' }]}
        onPress={handleArchive}
      >
        <MaterialCommunityIcons name="archive-outline" size={22} color="#FFF" />
        <Text style={styles.swipeActionText}>Archive</Text>
      </RectButton>
      <RectButton 
        style={[styles.swipeAction, { backgroundColor: '#8E8E93' }]}
        onPress={handleMore}
      >
        <MaterialCommunityIcons name="dots-vertical" size={22} color="#FFF" />
        <Text style={styles.swipeActionText}>More</Text>
      </RectButton>
    </View>
  );

  return (
    <Swipeable 
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
    >
      <ChatListItem chat={chat} onPress={onPress} />
    </Swipeable>
  );
};

const EmptyChats = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <MaterialCommunityIcons name="check-circle-outline" size={80} color="#00A884" />
    </View>
    <Text style={styles.emptyTitle}>You haven't chat yet</Text>
    <TouchableOpacity style={styles.startButton}>
      <Text style={styles.startButtonText}>Start Chatting</Text>
    </TouchableOpacity>
  </View>
);

export default function ChatsScreen() {
  const theme = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);  // Iniciando vazio para testar

  const handleNewChat = () => {
    // TODO: Implement new chat functionality
    console.log('New chat pressed');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="FlashChat"
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action 
          icon="message-plus-outline" 
          color="#fff" 
          onPress={handleNewChat}
          style={styles.headerButton}
        />
      </Appbar.Header>

      <View style={styles.listContainer}>
        {chats.length > 0 ? (
          <FlashList
            data={chats}
            renderItem={({ item }) => (
              <SwipeableChatItem
                chat={item}
                onPress={() => router.push(`/chats/${item.id}`)}
              />
            )}
            estimatedItemSize={76}
          />
        ) : (
          <EmptyChats />
        )}
      </View>

      <FAB
        icon="message-plus"
        style={styles.fab}
        color="#fff"
        onPress={handleNewChat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#008069',
    elevation: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#008069',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIndicator: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 2,
    marginLeft: 5,
  },
  chatInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  messageIcon: {
    marginRight: 5,
  },
  lastMessage: {
    fontSize: 14,
  },
  unreadMessage: {
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 2,
    marginLeft: 5,
  },
  mutedBadge: {
    backgroundColor: '#8E8E93',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    paddingHorizontal: 8,
  },
  swipeActionText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  headerButton: {
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00A88410',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 32,
    fontWeight: '300',
  },
  startButton: {
    backgroundColor: '#00A884',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 