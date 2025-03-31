import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Message } from '../../types/chat';

interface ChatBubbleProps {
  message: Message;
  isSender: boolean;
}

export function ChatBubble({ message, isSender }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    <View style={[
      styles.container,
      isSender ? styles.senderContainer : styles.receiverContainer,
    ]}>
      <View style={[
        styles.bubble,
        isSender ? styles.senderBubble : styles.receiverBubble,
      ]}>
        <Text style={styles.text}>{message.text}</Text>
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={styles.time}>
            {formatTime(message.timestamp)}
          </Text>
          {isSender && (
            <MaterialCommunityIcons
              name={getStatusIcon(message.status)}
              size={16}
              color={getStatusColor(message.status)}
              style={styles.statusIcon}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
  },
  senderContainer: {
    justifyContent: 'flex-end',
  },
  receiverContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: 8,
    borderRadius: 8,
    elevation: 1,
  },
  senderBubble: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#000000',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#8696A0',
    marginRight: 4,
  },
  statusIcon: {
    marginLeft: 2,
  },
}); 