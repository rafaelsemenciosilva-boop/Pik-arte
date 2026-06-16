import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawingCanvas, { DrawingCanvasRef, Stroke } from '../components/DrawingCanvas';
import ToolBar from '../components/ToolBar';
import ColorPicker from '../components/ColorPicker';
import AIAssistant from '../components/AIAssistant';
import SettingsScreen from './SettingsScreen';
import { ToolType, TOOLS } from '../constants/tools';
import { APP_COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const STORAGE_KEY = '@pikarte_current_drawing';
const GEMINI_KEY_STORAGE = '@pikarte_gemini_key';

export default function DrawingScreen() {
  const [selectedTool, setSelectedTool] = useState<ToolType>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [opacity, setOpacity] = useState(1.0);
  const [canvasBg, setCanvasBg] = useState('#FFFFFF');
  const [recentColors, setRecentColors] = useState<string[]>([
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
  ]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const canvasRef = useRef<DrawingCanvasRef>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [key, bg] = await Promise.all([
        AsyncStorage.getItem(GEMINI_KEY_STORAGE),
        AsyncStorage.getItem('@pikarte_canvas_bg'),
      ]);
      if (key) setGeminiKey(key);
      if (bg) setCanvasBg(bg);
    } catch (e) {
      console.error('Load settings error:', e);
    }
  };

  const handleSelectColor = useCallback((color: string) => {
    setCurrentColor(color);
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 10);
    });
  }, []);

  const handleSelectTool = useCallback((tool: ToolType) => {
    setSelectedTool(tool);
    const toolDef = TOOLS.find((t) => t.id === tool);
    if (toolDef) {
      setBrushSize(toolDef.defaultSize);
      setOpacity(toolDef.defaultOpacity);
    }
  }, []);

  const handleClear = () => {
    Alert.alert(
      'Limpar Canvas',
      'Tem certeza que deseja apagar todo o desenho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => canvasRef.current?.clear(),
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      const strokes = canvasRef.current?.getStrokes() ?? [];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(strokes));
      Alert.alert('✓ Salvo', 'Seu desenho foi salvo com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o desenho.');
    }
  };

  const handleAI = () => {
    if (!geminiKey) {
      Alert.alert(
        '🤖 Configurar IA',
        'Para usar o assistente Gemini, você precisa configurar sua chave de API.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configurar', onPress: () => setShowSettings(true) },
        ]
      );
      return;
    }
    setShowAI(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    loadSettings();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={APP_COLORS.surface}
        translucent={false}
      />

      {/* Barra de Ferramentas Superior + Lateral */}
      <ToolBar
        selectedTool={selectedTool}
        brushSize={brushSize}
        opacity={opacity}
        currentColor={currentColor}
        onSelectTool={handleSelectTool}
        onBrushSizeChange={setBrushSize}
        onOpacityChange={setOpacity}
        onOpenColorPicker={() => setShowColorPicker(true)}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        onClear={handleClear}
        onSave={handleSave}
        onAI={handleAI}
        recentColors={recentColors}
      />

      {/* Canvas Principal */}
      <View style={styles.canvasWrapper}>
        <DrawingCanvas
          ref={canvasRef}
          tool={selectedTool}
          color={currentColor}
          size={brushSize}
          opacity={opacity}
          backgroundColor={canvasBg}
        />
      </View>

      {/* Modais */}
      <ColorPicker
        visible={showColorPicker}
        currentColor={currentColor}
        onSelectColor={handleSelectColor}
        onClose={() => setShowColorPicker(false)}
      />

      <AIAssistant
        visible={showAI}
        onClose={() => setShowAI(false)}
        apiKey={geminiKey}
        onSelectColor={(color) => {
          handleSelectColor(color);
          setShowAI(false);
        }}
      />

      <SettingsScreen
        visible={showSettings}
        onClose={handleSettingsClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  canvasWrapper: {
    flex: 1,
    marginRight: 52, // Espaço para a barra lateral direita
  },
});
