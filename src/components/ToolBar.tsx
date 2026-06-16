import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { APP_COLORS } from '../constants/colors';
import { TOOLS, BRUSH_SIZES, Tool, ToolType } from '../constants/tools';

const { width, height } = Dimensions.get('window');

interface ToolBarProps {
  selectedTool: ToolType;
  brushSize: number;
  opacity: number;
  currentColor: string;
  onSelectTool: (tool: ToolType) => void;
  onBrushSizeChange: (size: number) => void;
  onOpacityChange: (opacity: number) => void;
  onOpenColorPicker: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onAI: () => void;
  recentColors: string[];
}

export default function ToolBar({
  selectedTool,
  brushSize,
  opacity,
  currentColor,
  onSelectTool,
  onBrushSizeChange,
  onOpacityChange,
  onOpenColorPicker,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onAI,
  recentColors,
}: ToolBarProps) {
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [showToolsPanel, setShowToolsPanel] = useState(false);

  const drawTools = TOOLS.filter((t) => t.category === 'draw');
  const shapeTools = TOOLS.filter((t) => t.category === 'shape');
  const editTools = TOOLS.filter((t) => t.category === 'edit');

  const currentTool = TOOLS.find((t) => t.id === selectedTool);

  const renderToolBtn = (tool: Tool) => (
    <TouchableOpacity
      key={tool.id}
      style={[
        styles.toolBtn,
        selectedTool === tool.id && styles.toolBtnActive,
      ]}
      onPress={() => {
        onSelectTool(tool.id);
        setShowToolsPanel(false);
      }}
    >
      <Text style={styles.toolBtnIcon}>{tool.icon}</Text>
      <Text
        style={[
          styles.toolBtnLabel,
          selectedTool === tool.id && styles.toolBtnLabelActive,
        ]}
        numberOfLines={1}
      >
        {tool.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Barra Superior */}
      <View style={styles.topBar}>
        {/* Esquerda: Ações */}
        <View style={styles.topLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={onUndo}>
            <Text style={styles.iconBtnText}>↩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onRedo}>
            <Text style={styles.iconBtnText}>↪</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.clearBtn]} onPress={onClear}>
            <Text style={styles.iconBtnText}>🗑</Text>
          </TouchableOpacity>
        </View>

        {/* Centro: Ferramenta atual */}
        <TouchableOpacity
          style={styles.currentToolDisplay}
          onPress={() => setShowToolsPanel(true)}
        >
          <Text style={styles.currentToolIcon}>{currentTool?.icon}</Text>
          <Text style={styles.currentToolName}>{currentTool?.label}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Direita: Cor + Salvar + IA */}
        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={onSave}>
            <Text style={styles.iconBtnText}>💾</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.aiBtn]}
            onPress={onAI}
          >
            <Text style={styles.iconBtnText}>✨</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorBtn, { backgroundColor: currentColor }]}
            onPress={onOpenColorPicker}
          />
        </View>
      </View>

      {/* Barra Lateral Direita — Ferramentas Rápidas + Cores */}
      <View style={styles.rightBar}>
        {/* Cores recentes */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={[styles.colorDot, { backgroundColor: currentColor }]}
            onPress={onOpenColorPicker}
          />
          {recentColors.slice(0, 5).map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                c === currentColor && styles.colorDotActive,
              ]}
              onPress={() => {}}
            />
          ))}
        </View>

        <View style={styles.divider} />

        {/* Ferramentas rápidas */}
        <ScrollView
          style={styles.rightTools}
          showsVerticalScrollIndicator={false}
        >
          {TOOLS.slice(0, 8).map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.rightToolBtn,
                selectedTool === tool.id && styles.rightToolBtnActive,
              ]}
              onPress={() => onSelectTool(tool.id)}
            >
              <Text style={styles.rightToolIcon}>{tool.icon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* Tamanho do pincel */}
        <TouchableOpacity
          style={styles.sizeBtn}
          onPress={() => setShowSizePanel(!showSizePanel)}
        >
          <View
            style={[
              styles.sizeDot,
              {
                width: Math.min(brushSize * 1.5, 28),
                height: Math.min(brushSize * 1.5, 28),
                backgroundColor: currentColor,
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* Painel de Tamanho */}
      {showSizePanel && (
        <View style={styles.sizePanel}>
          <Text style={styles.panelTitle}>Tamanho</Text>
          {BRUSH_SIZES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.sizePanelBtn,
                brushSize === s && styles.sizePanelBtnActive,
              ]}
              onPress={() => {
                onBrushSizeChange(s);
                setShowSizePanel(false);
              }}
            >
              <View
                style={[
                  styles.sizePanelDot,
                  {
                    width: Math.min(s * 1.2, 24),
                    height: Math.min(s * 1.2, 24),
                    backgroundColor: brushSize === s ? APP_COLORS.primary : currentColor,
                  },
                ]}
              />
              <Text style={styles.sizePanelLabel}>{s}px</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.panelTitle, { marginTop: 12 }]}>Opacidade</Text>
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((o) => (
            <TouchableOpacity
              key={o}
              style={[
                styles.sizePanelBtn,
                opacity === o && styles.sizePanelBtnActive,
              ]}
              onPress={() => {
                onOpacityChange(o);
                setShowSizePanel(false);
              }}
            >
              <View
                style={[
                  styles.opacityDot,
                  { opacity: o, backgroundColor: currentColor },
                ]}
              />
              <Text style={styles.sizePanelLabel}>{Math.round(o * 100)}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal de Ferramentas */}
      <Modal
        visible={showToolsPanel}
        transparent
        animationType="fade"
        onRequestClose={() => setShowToolsPanel(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowToolsPanel(false)}
        />
        <View style={styles.toolsModal}>
          <Text style={styles.modalTitle}>Ferramentas de Desenho</Text>

          <Text style={styles.toolCategory}>✏️ Pincéis & Canetas</Text>
          <View style={styles.toolGrid}>
            {drawTools.map(renderToolBtn)}
          </View>

          <Text style={styles.toolCategory}>⬜ Formas</Text>
          <View style={styles.toolGrid}>
            {shapeTools.map(renderToolBtn)}
          </View>

          <Text style={styles.toolCategory}>🔧 Edição</Text>
          <View style={styles.toolGrid}>
            {editTools.map(renderToolBtn)}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: APP_COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
    zIndex: 10,
  },
  topLeft: {
    flexDirection: 'row',
    gap: 4,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: APP_COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    backgroundColor: '#2A1515',
  },
  aiBtn: {
    backgroundColor: '#1A0D2E',
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
  },
  iconBtnText: {
    fontSize: 16,
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  currentToolDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  currentToolIcon: {
    fontSize: 16,
  },
  currentToolName: {
    color: APP_COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownArrow: {
    color: APP_COLORS.textMuted,
    fontSize: 10,
  },
  rightBar: {
    position: 'absolute',
    right: 0,
    top: 60,
    bottom: 0,
    width: 52,
    backgroundColor: APP_COLORS.surface,
    borderLeftWidth: 1,
    borderLeftColor: APP_COLORS.border,
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 5,
  },
  rightSection: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  colorDotActive: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: APP_COLORS.border,
    marginVertical: 6,
  },
  rightTools: {
    flex: 1,
    width: '100%',
  },
  rightToolBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginHorizontal: 4,
  },
  rightToolBtnActive: {
    backgroundColor: APP_COLORS.primary,
  },
  rightToolIcon: {
    fontSize: 20,
  },
  sizeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  sizeDot: {
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
  },
  sizePanel: {
    position: 'absolute',
    right: 56,
    bottom: 60,
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    zIndex: 20,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  panelTitle: {
    color: APP_COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sizePanelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 8,
  },
  sizePanelBtnActive: {
    backgroundColor: APP_COLORS.surfaceLight,
  },
  sizePanelDot: {
    borderRadius: 50,
  },
  opacityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  sizePanelLabel: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  toolsModal: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 56,
    backgroundColor: APP_COLORS.surface,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: APP_COLORS.border,
    zIndex: 30,
  },
  modalTitle: {
    color: APP_COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  toolCategory: {
    color: APP_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  toolBtn: {
    width: (width - 56 - 32 - 40) / 5,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: APP_COLORS.surfaceLight,
    alignItems: 'center',
    gap: 4,
  },
  toolBtnActive: {
    backgroundColor: APP_COLORS.primary,
  },
  toolBtnIcon: {
    fontSize: 20,
  },
  toolBtnLabel: {
    color: APP_COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  toolBtnLabelActive: {
    color: '#FFFFFF',
  },
});
