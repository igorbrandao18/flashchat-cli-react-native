import React, { useState } from 'react';
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
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
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

const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity style={[styles.swipeAction, { backgroundColor: '#4CD964' }]}>
        <MaterialCommunityIcons name="pin" size={24} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.swipeAction, { backgroundColor: '#007AFF' }]}>
        <MaterialCommunityIcons name="archive" size={24} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.swipeAction, { backgroundColor: '#FF3B30' }]}>
        <MaterialCommunityIcons name="delete" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <AnimatedTouchable
        style={[styles.chatItem, animatedStyle]}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
      >
        <View style={styles.avatarContainer}>
          <Avatar
            size={50}
            source={{ uri: chat.avatar }}
            online={chat.online}
          />
          {chat.isGroup && (
            <View style={styles.groupIndicator}>
              <MaterialCommunityIcons name="account-group" size={12} color="#FFF" />
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <View style={styles.nameContainer}>
              <Text style={styles.chatName} numberOfLines={1}>
                {chat.name}
              </Text>
              {chat.pinned && (
                <MaterialCommunityIcons name="pin" size={16} color="#8E8E93" />
              )}
              {chat.muted && (
                <MaterialCommunityIcons name="bell-off" size={16} color="#8E8E93" />
              )}
            </View>
            <Text style={styles.chatTime}>{formatMessageTime(chat.lastMessage.timestamp)}</Text>
          </View>

          <View style={styles.chatFooter}>
            <View style={styles.messageContainer}>
              {chat.typing ? (
                <Text style={styles.typingText}>digitando...</Text>
              ) : (
                <>
                  {chat.isVoiceMessage && (
                    <MaterialCommunityIcons name="microphone" size={16} color="#8E8E93" style={styles.messageIcon} />
                  )}
                  {chat.isPhoto && (
                    <MaterialCommunityIcons name="camera" size={16} color="#8E8E93" style={styles.messageIcon} />
                  )}
                  <Text 
                    style={[
                      styles.lastMessage,
                      chat.unreadCount > 0 && styles.unreadMessage
                    ]}
                    numberOfLines={1}
                  >
                    {chat.lastMessage.text}
                    {chat.isVoiceMessage && ` • ${chat.voiceDuration}`}
                    {chat.isPhoto && ' • Foto'}
                  </Text>
                </>
              )}
            </View>
            {chat.unreadCount > 0 && (
              <View style={[
                styles.unreadBadge,
                chat.muted && styles.mutedBadge
              ]}>
                <Text style={styles.unreadCount}>
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </AnimatedTouchable>
    </Swipeable>
  );
};

export default function ChatsScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Content
          title="FlashChat"
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action icon="dots-vertical" color="#fff" onPress={() => {}} />
      </Appbar.Header>

      <View style={{ padding: 8, backgroundColor: theme.colors.primary }}>
        <Searchbar
          placeholder="Pesquisar"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={theme.colors.primary}
        />
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={filteredChats}
          renderItem={({ item }) => (
            <ChatListItem
              chat={item}
              onPress={() => router.push(`/chats/${item.id}`)}
            />
          )}
          estimatedItemSize={76}
        />
      </View>

      <FAB
        icon="message-plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    elevation: 0,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
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
  },
  swipeAction: {
    padding: 10,
  },
}); 