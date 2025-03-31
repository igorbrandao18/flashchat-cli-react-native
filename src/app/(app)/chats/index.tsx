import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, FAB, Searchbar, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ChatListItem } from '../../../components/chat/ChatListItem';
import type { Chat } from '../../../types/chat';

// Dados mockados para exemplo
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: {
      text: 'Claro! Que tal amanhã?',
      timestamp: new Date(Date.now() - 1000 * 60 * 27),
      status: 'delivered',
    },
    unreadCount: 0,
    online: true,
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: {
      text: 'Obrigada pelo convite!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'read',
    },
    unreadCount: 2,
    online: false,
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
}); 