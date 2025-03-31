import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '../common/Avatar';
import type { Chat } from '../../types/chat';

interface ChatListItemProps {
  chat: Chat;
  onPress?: () => void;
}

export function ChatListItem({ chat, onPress }: ChatListItemProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ontem';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return 'check';
      case 'delivered':
        return 'check-all';
      case 'read':
        return 'check-all';
      default:
        return 'clock-outline';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'read' ? '#34B7F1' : '#8696A0';
  };

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <Avatar
        source={{ uri: chat.avatar }}
        size={56}
        online={chat.online}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.time}>
            {formatTime(chat.lastMessage.timestamp)}
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <View style={styles.messageContent}>
            {chat.lastMessage.status && (
              <MaterialCommunityIcons
                name={getStatusIcon(chat.lastMessage.status)}
                size={16}
                color={getStatusColor(chat.lastMessage.status)}
                style={styles.statusIcon}
              />
            )}
            <Text
              numberOfLines={1}
              style={[
                styles.message,
                chat.unreadCount > 0 && styles.unreadMessage,
              ]}
            >
              {chat.lastMessage.text}
            </Text>
          </View>

          {chat.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#8696A0',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#8696A0',
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
}); 