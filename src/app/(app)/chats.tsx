import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '../../components/common/Avatar';

// Mock data for chats
const mockChats = [
  {
    id: '1',
    name: 'João Silva',
    lastMessage: 'Oi, tudo bem?',
    time: '10:30',
    unreadCount: 2,
    avatar: 'https://i.pravatar.cc/150?img=1',
    online: true,
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    lastMessage: 'Vamos marcar aquele café?',
    time: '09:45',
    unreadCount: 0,
    avatar: 'https://i.pravatar.cc/150?img=2',
    online: false,
  },
  {
    id: '3',
    name: 'Pedro Santos',
    lastMessage: 'Ok, combinado então!',
    time: 'Ontem',
    unreadCount: 0,
    avatar: 'https://i.pravatar.cc/150?img=3',
    online: true,
  },
  {
    id: '4',
    name: 'Ana Costa',
    lastMessage: 'Me avisa quando chegar',
    time: 'Ontem',
    unreadCount: 1,
    avatar: 'https://i.pravatar.cc/150?img=4',
    online: false,
  },
];

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.editButton}>Editar</Text>
        <Text style={styles.title}>Conversas</Text>
        <TouchableOpacity style={styles.composeButton}>
          <MaterialCommunityIcons name="square-edit-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Secondary Navigation */}
      <View style={styles.secondaryNav}>
        <TouchableOpacity>
          <Text style={styles.secondaryNavText}>Listas de Transmissão</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.secondaryNavText}>Novo Grupo</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <View style={styles.chatList}>
        {mockChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => router.push(`/chats/${chat.id}`)}
          >
            <Avatar
              size={50}
              source={{ uri: chat.avatar }}
              online={chat.online}
            />
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatTime}>{chat.time}</Text>
              </View>
              <View style={styles.chatFooter}>
                <Text 
                  style={[
                    styles.lastMessage,
                    chat.unreadCount > 0 && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={20} 
              color="#C7C7CC"
              style={styles.chevron}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="account-circle-outline" size={24} color="#8E8E93" />
          <Text style={styles.tabLabel}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="phone-outline" size={24} color="#8E8E93" />
          <Text style={styles.tabLabel}>Chamadas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="camera-outline" size={24} color="#8E8E93" />
          <Text style={styles.tabLabel}>Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
          <MaterialCommunityIcons name="chat" size={24} color="#007AFF" />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Conversas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#8E8E93" />
          <Text style={styles.tabLabel}>Ajustes</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator (iOS) */}
      {Platform.OS === 'ios' && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#F6F6F6',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  editButton: {
    position: 'absolute',
    left: 16,
    fontSize: 17,
    color: '#007AFF',
  },
  title: {
    fontSize: 17,
    fontWeight: 'semibold',
    color: '#000000',
  },
  composeButton: {
    position: 'absolute',
    right: 16,
  },
  secondaryNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  secondaryNavText: {
    fontSize: 17,
    color: '#007AFF',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  chatTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 15,
    color: '#8E8E93',
    marginRight: 8,
  },
  unreadMessage: {
    color: '#000000',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 8,
    opacity: 0.3,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    backgroundColor: '#F6F6F6',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeTab: {
    color: '#007AFF',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: '#8E8E93',
  },
  activeTabLabel: {
    color: '#007AFF',
  },
  homeIndicator: {
    height: 34,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 2.5,
    opacity: 0.1,
  },
}); 