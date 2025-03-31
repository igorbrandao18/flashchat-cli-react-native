import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  onCamera?: () => void;
  onRecord?: () => void;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onAttach,
  onCamera,
  onRecord,
}: ChatInputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="emoticon-outline"
          size={24}
          color={theme.colors.primary}
          style={styles.icon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Mensagem"
          style={styles.input}
          multiline
        />
        <MaterialCommunityIcons
          name="paperclip"
          size={24}
          color={theme.colors.primary}
          style={styles.icon}
          onPress={onAttach}
        />
        <MaterialCommunityIcons
          name="camera"
          size={24}
          color={theme.colors.primary}
          style={styles.icon}
          onPress={onCamera}
        />
      </View>

      <Pressable
        style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
        onPress={value.trim() ? onSend : onRecord}
      >
        <MaterialCommunityIcons
          name={value.trim() ? 'send' : 'microphone'}
          size={24}
          color="#fff"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    marginHorizontal: 8,
  },
  icon: {
    marginBottom: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
}); 