import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Appbar, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { ChatBubble } from '../../../components/chat/ChatBubble';
import { ChatInput } from '../../../components/chat/ChatInput';
import { Avatar } from '../../../components/common/Avatar';
import type { Message } from '../../../types/chat';

// Dados mockados para exemplo
const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Oi, tudo bem?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'read',
    userId: 'other',
  },
  {
    id: '2',
    text: 'Tudo ótimo! E com você?',
    timestamp: new Date(Date.now() - 1000 * 60 * 29),
    status: 'read',
    userId: 'me',
  },
  {
    id: '3',
    text: 'Também! Vamos marcar aquele café?',
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    status: 'read',
    userId: 'other',
  },
  {
    id: '4',
    text: 'Claro! Que tal amanhã?',
    timestamp: new Date(Date.now() - 1000 * 60 * 27),
    status: 'delivered',
    userId: 'me',
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date(),
      status: 'sent',
      userId: 'me',
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color="#fff" onPress={() => router.back()} />
        <Avatar
          size={40}
          source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
          online={true}
          onPress={() => {}}
        />
        <Appbar.Content
          title="João Silva"
          titleStyle={styles.headerTitle}
          subtitle="online"
          subtitleStyle={styles.headerSubtitle}
        />
        <Appbar.Action icon="video" color="#fff" onPress={() => {}} />
        <Appbar.Action icon="phone" color="#fff" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" color="#fff" onPress={() => {}} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.messageList}>
          <FlashList
            data={messages}
            renderItem={({ item }) => (
              <ChatBubble
                message={item}
                isSender={item.userId === 'me'}
              />
            )}
            estimatedItemSize={70}
            inverted
          />
        </View>

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          onAttach={() => {}}
          onCamera={() => {}}
          onRecord={() => {}}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 8,
  },
}); 