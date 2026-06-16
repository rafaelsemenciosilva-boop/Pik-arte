import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { APP_COLORS } from '../constants/colors';
import { getGeminiService } from '../utils/geminiService';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'text' | 'tip' | 'palette' | 'idea';
  colors?: string[];
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  apiKey: string;
  onSelectColor?: (color: string) => void;
}

const QUICK_PROMPTS = [
  { label: '💡 Ideia de desenho', prompt: 'Me dê uma ideia criativa de desenho para hoje' },
  { label: '🎨 Paleta de cores', prompt: 'Sugira uma paleta de cores harmoniosa para natureza' },
  { label: '✏️ Dica de lápis', prompt: 'Como melhorar meu traço com lápis?' },
  { label: '🌟 Para iniciantes', prompt: 'Qual é o melhor exercício para quem está começando a desenhar?' },
  { label: '🖌️ Técnica de pincel', prompt: 'Explique técnicas básicas de pincel digital' },
  { label: '🎭 Expressões faciais', prompt: 'Como desenhar expressões faciais realistas?' },
];

export default function AIAssistant({
  visible,
  onClose,
  apiKey,
  onSelectColor,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: 'Olá! Sou o **Pik**, seu assistente de arte! 🎨\n\nPosso te ajudar com:\n• Dicas de desenho e técnicas\n• Sugestões de paletas de cores\n• Ideias criativas\n• Análise do seu esboço\n\nO que você gostaria de aprender hoje?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tips' | 'ideas'>('chat');
  const scrollRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const gemini = getGeminiService(apiKey);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnim.stopAnimation();
      typingAnim.setValue(0);
    }
  }, [isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await gemini.chat(text.trim());
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'ai',
          content: '⚠️ Não consegui me conectar. Verifique sua chave de API Gemini.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleGetIdea = async () => {
    setIsLoading(true);
    try {
      const idea = await gemini.generateDrawingIdea();
      const msg: Message = {
        id: `idea_${Date.now()}`,
        role: 'ai',
        content: `💡 **Ideia de Desenho:**\n\n${idea}`,
        timestamp: new Date(),
        type: 'idea',
      };
      setMessages((prev) => [...prev, msg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleGetPalette = async () => {
    setIsLoading(true);
    try {
      const colors = await gemini.suggestColorPalette('arte digital moderna');
      const msg: Message = {
        id: `palette_${Date.now()}`,
        role: 'ai',
        content: '🎨 **Paleta de Cores Sugerida:**\nToque em uma cor para selecioná-la!',
        timestamp: new Date(),
        type: 'palette',
        colors,
      };
      setMessages((prev) => [...prev, msg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = (msg: Message) => {
    const isAI = msg.role === 'ai';
    return (
      <View
        key={msg.id}
        style={[styles.messageRow, isAI ? styles.aiRow : styles.userRow]}
      >
        {isAI && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🎨</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isAI ? styles.aiBubble : styles.userBubble,
          ]}
        >
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {msg.content}
          </Text>
          {msg.type === 'palette' && msg.colors && (
            <View style={styles.paletteRow}>
              {msg.colors.map((color, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.paletteSwatch, { backgroundColor: color }]}
                  onPress={() => onSelectColor?.(color)}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>✨</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Pik — Assistente IA</Text>
              <Text style={styles.headerSubtitle}>Powered by Gemini</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActions}
          contentContainerStyle={styles.quickActionsContent}
        >
          <TouchableOpacity style={styles.quickAction} onPress={handleGetIdea}>
            <Text style={styles.quickActionText}>💡 Ideia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleGetPalette}>
            <Text style={styles.quickActionText}>🎨 Paleta</Text>
          </TouchableOpacity>
          {QUICK_PROMPTS.map((qp, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickAction}
              onPress={() => sendMessage(qp.prompt)}
            >
              <Text style={styles.quickActionText}>{qp.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={[styles.messageRow, styles.aiRow]}>
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>🎨</Text>
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <Animated.View style={[styles.typingDots, { opacity: typingAnim }]}>
                  <Text style={styles.typingText}>Pensando...</Text>
                </Animated.View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Pergunte algo sobre arte..."
            placeholderTextColor={APP_COLORS.textMuted}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(inputText)}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || isLoading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendBtnText}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconText: {
    fontSize: 22,
  },
  headerTitle: {
    color: APP_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: APP_COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: APP_COLORS.textMuted,
    fontSize: 16,
  },
  quickActions: {
    maxHeight: 48,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  quickActionsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  quickAction: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: APP_COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  quickActionText: {
    color: APP_COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  aiRow: {
    alignItems: 'flex-start',
  },
  userRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 4,
  },
  aiAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: APP_COLORS.surface,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  userBubble: {
    backgroundColor: APP_COLORS.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    color: APP_COLORS.text,
  },
  userText: {
    color: '#FFFFFF',
  },
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  paletteSwatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  typingText: {
    color: APP_COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'android' ? 16 : 12,
    backgroundColor: APP_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: APP_COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: APP_COLORS.text,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: APP_COLORS.surfaceLight,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
