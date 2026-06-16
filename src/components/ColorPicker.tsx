import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Animated,
  FlatList,
} from 'react-native';
import { APP_COLORS, COLOR_FAMILIES, QUICK_COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const SWATCH_SIZE = (width - 80) / 10;

interface ColorPickerProps {
  visible: boolean;
  currentColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

export default function ColorPicker({
  visible,
  currentColor,
  onSelectColor,
  onClose,
}: ColorPickerProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'palette' | 'hex'>('quick');
  const [hexInput, setHexInput] = useState(currentColor);
  const [hexError, setHexError] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(0);

  const validateHex = (hex: string) => {
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
  };

  const handleHexChange = (text: string) => {
    let val = text.toUpperCase();
    if (!val.startsWith('#')) val = '#' + val;
    setHexInput(val);
    if (validateHex(val)) {
      setHexError(false);
      onSelectColor(val);
    } else {
      setHexError(true);
    }
  };

  const handleSwatchPress = (color: string) => {
    setHexInput(color);
    setHexError(false);
    onSelectColor(color);
  };

  const renderColorSwatch = (color: string, size = SWATCH_SIZE) => (
    <TouchableOpacity
      key={color}
      onPress={() => handleSwatchPress(color)}
      style={[
        styles.swatch,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderWidth: currentColor === color ? 3 : 1,
          borderColor: currentColor === color ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
          borderRadius: size * 0.25,
        },
      ]}
    />
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.previewRow}>
            <View
              style={[styles.colorPreview, { backgroundColor: currentColor }]}
            />
            <View>
              <Text style={styles.headerTitle}>Cor Selecionada</Text>
              <Text style={styles.headerHex}>{currentColor}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['quick', 'palette', 'hex'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'quick' ? '⚡ Rápido' : tab === 'palette' ? '🎨 Paleta' : '# Hex'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'quick' && (
            <View>
              <Text style={styles.sectionTitle}>Cores Rápidas</Text>
              <View style={styles.swatchGrid}>
                {QUICK_COLORS.map((c) => renderColorSwatch(c, (width - 60) / 8))}
              </View>

              <Text style={styles.sectionTitle}>Preto & Branco</Text>
              <View style={styles.swatchGrid}>
                {['#000000', '#111111', '#333333', '#555555', '#777777', '#999999', '#BBBBBB', '#DDDDDD', '#EEEEEE', '#FFFFFF'].map((c) =>
                  renderColorSwatch(c, (width - 60) / 10)
                )}
              </View>

              <Text style={styles.sectionTitle}>Cores Básicas</Text>
              <View style={styles.swatchGrid}>
                {[
                  '#FF0000', '#FF4500', '#FF6600', '#FF8C00', '#FFA500',
                  '#FFD700', '#FFFF00', '#9ACD32', '#00FF00', '#00FA9A',
                  '#00FFFF', '#00BFFF', '#0000FF', '#8A2BE2', '#FF00FF',
                  '#FF1493', '#FF69B4', '#DC143C', '#8B0000', '#006400',
                ].map((c) => renderColorSwatch(c, (width - 60) / 10))}
              </View>
            </View>
          )}

          {activeTab === 'palette' && (
            <View>
              {/* Seletor de família */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.familyScroll}
              >
                {COLOR_FAMILIES.map((family, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.familyChip,
                      selectedFamily === idx && styles.familyChipActive,
                    ]}
                    onPress={() => setSelectedFamily(idx)}
                  >
                    <View
                      style={[
                        styles.familyDot,
                        { backgroundColor: family.colors[5] || family.colors[0] },
                      ]}
                    />
                    <Text
                      style={[
                        styles.familyChipText,
                        selectedFamily === idx && styles.familyChipTextActive,
                      ]}
                    >
                      {family.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Grade de cores da família selecionada */}
              <Text style={styles.sectionTitle}>
                {COLOR_FAMILIES[selectedFamily].name}
              </Text>
              <View style={styles.swatchGrid}>
                {COLOR_FAMILIES[selectedFamily].colors.map((c) =>
                  renderColorSwatch(c, (width - 60) / 8)
                )}
              </View>

              {/* Todas as famílias */}
              <Text style={styles.sectionTitle}>Todas as Cores</Text>
              {COLOR_FAMILIES.map((family, idx) => (
                <View key={idx} style={styles.familySection}>
                  <Text style={styles.familyLabel}>{family.name}</Text>
                  <View style={styles.swatchRow}>
                    {family.colors.slice(0, 10).map((c) => renderColorSwatch(c, (width - 60) / 10))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'hex' && (
            <View style={styles.hexSection}>
              <Text style={styles.sectionTitle}>Inserir Código Hex</Text>
              <View style={styles.hexInputRow}>
                <View
                  style={[
                    styles.hexPreview,
                    { backgroundColor: validateHex(hexInput) ? hexInput : '#333' },
                  ]}
                />
                <TextInput
                  style={[styles.hexInput, hexError && styles.hexInputError]}
                  value={hexInput}
                  onChangeText={handleHexChange}
                  placeholder="#FF0000"
                  placeholderTextColor="#555"
                  maxLength={7}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              {hexError && (
                <Text style={styles.hexErrorText}>
                  Formato inválido. Use #RRGGBB (ex: #FF5500)
                </Text>
              )}

              <Text style={styles.sectionTitle}>Gradientes Populares</Text>
              <View style={styles.gradientGrid}>
                {[
                  ['#FF6B6B', '#FF8E53'],
                  ['#A855F7', '#EC4899'],
                  ['#06B6D4', '#3B82F6'],
                  ['#10B981', '#06B6D4'],
                  ['#F59E0B', '#EF4444'],
                  ['#8B5CF6', '#06B6D4'],
                  ['#EC4899', '#F97316'],
                  ['#14B8A6', '#8B5CF6'],
                ].map(([c1, c2], i) => (
                  <View key={i} style={styles.gradientRow}>
                    {renderColorSwatch(c1, 44)}
                    <Text style={styles.gradientArrow}>→</Text>
                    {renderColorSwatch(c2, 44)}
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: APP_COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: APP_COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
    marginBottom: 2,
  },
  headerHex: {
    color: APP_COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
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
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: APP_COLORS.surfaceLight,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: APP_COLORS.primary,
  },
  tabText: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: APP_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  swatch: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  familyScroll: {
    marginBottom: 4,
  },
  familyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: APP_COLORS.surfaceLight,
    marginRight: 8,
    gap: 6,
  },
  familyChipActive: {
    backgroundColor: APP_COLORS.primary,
  },
  familyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  familyChipText: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  familyChipTextActive: {
    color: '#FFFFFF',
  },
  familySection: {
    marginBottom: 12,
  },
  familyLabel: {
    color: APP_COLORS.textMuted,
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '600',
  },
  hexSection: {
    paddingTop: 8,
  },
  hexInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  hexPreview: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  hexInput: {
    flex: 1,
    height: 52,
    backgroundColor: APP_COLORS.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: APP_COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
    borderWidth: 2,
    borderColor: APP_COLORS.border,
  },
  hexInputError: {
    borderColor: APP_COLORS.error,
  },
  hexErrorText: {
    color: APP_COLORS.error,
    fontSize: 12,
    marginBottom: 8,
  },
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gradientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gradientArrow: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
  },
});
