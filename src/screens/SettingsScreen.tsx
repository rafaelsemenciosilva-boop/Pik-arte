import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

const STORAGE_KEYS = {
  GEMINI_KEY: '@pikarte_gemini_key',
  CANVAS_BG: '@pikarte_canvas_bg',
  HAPTICS: '@pikarte_haptics',
  AUTO_SAVE: '@pikarte_autosave',
};

export default function SettingsScreen({ visible, onClose }: SettingsScreenProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [canvasBg, setCanvasBg] = useState('#FFFFFF');
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (visible) loadSettings();
  }, [visible]);

  const loadSettings = async () => {
    try {
      const [key, bg, haptics, autosave] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.GEMINI_KEY),
        AsyncStorage.getItem(STORAGE_KEYS.CANVAS_BG),
        AsyncStorage.getItem(STORAGE_KEYS.HAPTICS),
        AsyncStorage.getItem(STORAGE_KEYS.AUTO_SAVE),
      ]);
      if (key) setGeminiKey(key);
      if (bg) setCanvasBg(bg);
      if (haptics !== null) setHapticsEnabled(haptics === 'true');
      if (autosave !== null) setAutoSave(autosave === 'true');
    } catch (e) {
      console.error('Load settings error:', e);
    }
  };

  const saveSettings = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.GEMINI_KEY, geminiKey),
        AsyncStorage.setItem(STORAGE_KEYS.CANVAS_BG, canvasBg),
        AsyncStorage.setItem(STORAGE_KEYS.HAPTICS, String(hapticsEnabled)),
        AsyncStorage.setItem(STORAGE_KEYS.AUTO_SAVE, String(autoSave)),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const BG_OPTIONS = [
    { label: 'Branco', color: '#FFFFFF' },
    { label: 'Creme', color: '#FFF8F0' },
    { label: 'Cinza Claro', color: '#F0F0F0' },
    { label: 'Cinza', color: '#808080' },
    { label: 'Preto', color: '#000000' },
    { label: 'Azul Escuro', color: '#0D1B2A' },
    { label: 'Kraft', color: '#C4A882' },
    { label: 'Verde Escuro', color: '#1A2E1A' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações</Text>
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
            onPress={saveSettings}
          >
            <Text style={styles.saveBtnText}>{saved ? '✓ Salvo' : 'Salvar'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Seção: Gemini AI */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 Gemini AI</Text>
            <Text style={styles.sectionDesc}>
              Configure sua chave de API do Google Gemini para usar o assistente de arte inteligente.
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.keyInput}
                value={geminiKey}
                onChangeText={setGeminiKey}
                placeholder="AIza... (sua chave de API)"
                placeholderTextColor={APP_COLORS.textMuted}
                secureTextEntry={!showKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowKey(!showKey)}
              >
                <Text style={styles.eyeBtnText}>{showKey ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => {
                Alert.alert(
                  'Obter Chave Gemini',
                  'Acesse aistudio.google.com, faça login com sua conta Google e crie uma nova chave de API gratuitamente.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.linkBtnText}>📋 Como obter minha chave gratuita?</Text>
            </TouchableOpacity>
          </View>

          {/* Seção: Canvas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🖼 Canvas</Text>
            <Text style={styles.sectionLabel}>Cor de fundo padrão</Text>
            <View style={styles.bgGrid}>
              {BG_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.color}
                  style={[
                    styles.bgOption,
                    { backgroundColor: opt.color },
                    canvasBg === opt.color && styles.bgOptionActive,
                  ]}
                  onPress={() => setCanvasBg(opt.color)}
                >
                  {canvasBg === opt.color && (
                    <Text style={[
                      styles.bgCheck,
                      { color: opt.color === '#FFFFFF' || opt.color === '#FFF8F0' || opt.color === '#F0F0F0' ? '#000' : '#FFF' }
                    ]}>✓</Text>
                  )}
                  <Text style={[
                    styles.bgLabel,
                    { color: opt.color === '#FFFFFF' || opt.color === '#FFF8F0' || opt.color === '#F0F0F0' ? '#333' : '#FFF' }
                  ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Seção: Preferências */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Preferências</Text>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Vibração ao desenhar</Text>
                <Text style={styles.toggleDesc}>Feedback tátil ao usar ferramentas</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: APP_COLORS.border, true: APP_COLORS.primary }}
                thumbColor={hapticsEnabled ? '#FFFFFF' : APP_COLORS.textMuted}
              />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Salvar automaticamente</Text>
                <Text style={styles.toggleDesc}>Salva o desenho a cada 5 minutos</Text>
              </View>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: APP_COLORS.border, true: APP_COLORS.primary }}
                thumbColor={autoSave ? '#FFFFFF' : APP_COLORS.textMuted}
              />
            </View>
          </View>

          {/* Sobre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ Sobre</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Pik-arte</Text>
              <Text style={styles.aboutVersion}>Versão 1.0.0</Text>
              <Text style={styles.aboutDesc}>
                App de desenho e criação de imagens com assistente IA. Desenvolvido para artistas e designers de todos os níveis.
              </Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: APP_COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: APP_COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    color: APP_COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: APP_COLORS.primary,
  },
  saveBtnSuccess: {
    backgroundColor: APP_COLORS.success,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  sectionTitle: {
    color: APP_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDesc: {
    color: APP_COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  sectionLabel: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keyInput: {
    flex: 1,
    backgroundColor: APP_COLORS.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: APP_COLORS.text,
    fontSize: 13,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  },
  eyeBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: APP_COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  eyeBtnText: {
    fontSize: 20,
  },
  linkBtn: {
    marginTop: 10,
    paddingVertical: 8,
  },
  linkBtnText: {
    color: APP_COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  bgGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bgOption: {
    width: (width - 80) / 4,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bgOptionActive: {
    borderColor: APP_COLORS.primary,
  },
  bgCheck: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
  },
  bgLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  toggleLabel: {
    color: APP_COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleDesc: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  aboutTitle: {
    color: APP_COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  aboutVersion: {
    color: APP_COLORS.primary,
    fontSize: 13,
    marginVertical: 4,
  },
  aboutDesc: {
    color: APP_COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});
