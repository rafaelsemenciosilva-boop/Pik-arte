import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, {
  Path,
  Line,
  Rect,
  Circle,
  Ellipse,
  Polygon,
  G,
  Defs,
  Filter,
  FeGaussianBlur,
} from 'react-native-svg';
import { ToolType } from '../constants/tools';

const { width, height } = Dimensions.get('window');

export interface StrokePoint {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  tool: ToolType;
  color: string;
  size: number;
  opacity: number;
  points: StrokePoint[];
  // Para formas
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export interface DrawingCanvasRef {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  getStrokes: () => Stroke[];
  setStrokes: (strokes: Stroke[]) => void;
}

interface DrawingCanvasProps {
  tool: ToolType;
  color: string;
  size: number;
  opacity: number;
  backgroundColor: string;
  onStrokeEnd?: (strokes: Stroke[]) => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ tool, color, size, opacity, backgroundColor, onStrokeEnd }, ref) => {
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
    const canvasLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const strokeIdCounter = useRef(0);
    const isDrawing = useRef(false);

    useImperativeHandle(ref, () => ({
      undo: () => {
        setStrokes((prev) => {
          if (prev.length === 0) return prev;
          const newStrokes = prev.slice(0, -1);
          setRedoStack((r) => [...r, prev]);
          return newStrokes;
        });
      },
      redo: () => {
        setRedoStack((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          setStrokes(last);
          return prev.slice(0, -1);
        });
      },
      clear: () => {
        setRedoStack((r) => [...r, strokes]);
        setStrokes([]);
        setCurrentStroke(null);
      },
      getStrokes: () => strokes,
      setStrokes: (s) => setStrokes(s),
    }));

    const isShapeTool = (t: ToolType) =>
      ['line', 'rect', 'circle', 'triangle', 'arrow'].includes(t);

    const getStrokeStyle = (t: ToolType) => {
      switch (t) {
        case 'pen': return { linecap: 'round' as const, linejoin: 'round' as const };
        case 'pencil': return { linecap: 'round' as const, linejoin: 'round' as const };
        case 'brush': return { linecap: 'round' as const, linejoin: 'round' as const };
        case 'marker': return { linecap: 'square' as const, linejoin: 'miter' as const };
        case 'calligraphy': return { linecap: 'butt' as const, linejoin: 'bevel' as const };
        case 'airbrush': return { linecap: 'round' as const, linejoin: 'round' as const };
        case 'eraser': return { linecap: 'round' as const, linejoin: 'round' as const };
        default: return { linecap: 'round' as const, linejoin: 'round' as const };
      }
    };

    const getEffectiveSize = (t: ToolType, s: number) => {
      if (t === 'airbrush') return s * 2.5;
      if (t === 'brush') return s * 1.5;
      if (t === 'marker') return s * 1.2;
      return s;
    };

    const getEffectiveOpacity = (t: ToolType, o: number) => {
      if (t === 'airbrush') return o * 0.35;
      if (t === 'pencil') return o * 0.85;
      return o;
    };

    const pointsToPath = (points: StrokePoint[]): string => {
      if (points.length === 0) return '';
      if (points.length === 1) {
        const p = points[0];
        return `M ${p.x} ${p.y} L ${p.x + 0.1} ${p.y + 0.1}`;
      }
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length - 1; i++) {
        const mx = (points[i].x + points[i + 1].x) / 2;
        const my = (points[i].y + points[i + 1].y) / 2;
        d += ` Q ${points[i].x} ${points[i].y} ${mx} ${my}`;
      }
      const last = points[points.length - 1];
      d += ` L ${last.x} ${last.y}`;
      return d;
    };

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          isDrawing.current = true;
          setRedoStack([]);
          const { locationX, locationY } = evt.nativeEvent;
          const newStroke: Stroke = {
            id: `stroke_${++strokeIdCounter.current}`,
            tool,
            color: tool === 'eraser' ? backgroundColor : color,
            size,
            opacity,
            points: [{ x: locationX, y: locationY }],
            startX: locationX,
            startY: locationY,
            endX: locationX,
            endY: locationY,
          };
          setCurrentStroke(newStroke);
        },
        onPanResponderMove: (evt) => {
          if (!isDrawing.current) return;
          const { locationX, locationY } = evt.nativeEvent;
          setCurrentStroke((prev) => {
            if (!prev) return prev;
            if (isShapeTool(prev.tool)) {
              return { ...prev, endX: locationX, endY: locationY };
            }
            return {
              ...prev,
              points: [...prev.points, { x: locationX, y: locationY }],
              endX: locationX,
              endY: locationY,
            };
          });
        },
        onPanResponderRelease: () => {
          isDrawing.current = false;
          setCurrentStroke((prev) => {
            if (!prev) return null;
            setStrokes((s) => {
              const newStrokes = [...s, prev];
              onStrokeEnd?.(newStrokes);
              return newStrokes;
            });
            return null;
          });
        },
      })
    ).current;

    const renderStroke = (stroke: Stroke, isPreview = false) => {
      const style = getStrokeStyle(stroke.tool);
      const effectiveSize = getEffectiveSize(stroke.tool, stroke.size);
      const effectiveOpacity = getEffectiveOpacity(stroke.tool, stroke.opacity);
      const strokeColor = stroke.tool === 'eraser' ? backgroundColor : stroke.color;
      const key = isPreview ? 'preview' : stroke.id;

      if (stroke.tool === 'line') {
        return (
          <Line
            key={key}
            x1={stroke.startX}
            y1={stroke.startY}
            x2={stroke.endX}
            y2={stroke.endY}
            stroke={strokeColor}
            strokeWidth={effectiveSize}
            strokeOpacity={effectiveOpacity}
            strokeLinecap="round"
          />
        );
      }

      if (stroke.tool === 'rect') {
        const x = Math.min(stroke.startX!, stroke.endX!);
        const y = Math.min(stroke.startY!, stroke.endY!);
        const w = Math.abs((stroke.endX ?? 0) - (stroke.startX ?? 0));
        const h = Math.abs((stroke.endY ?? 0) - (stroke.startY ?? 0));
        return (
          <Rect
            key={key}
            x={x}
            y={y}
            width={w}
            height={h}
            stroke={strokeColor}
            strokeWidth={effectiveSize}
            strokeOpacity={effectiveOpacity}
            fill="none"
          />
        );
      }

      if (stroke.tool === 'circle') {
        const cx = (stroke.startX! + stroke.endX!) / 2;
        const cy = (stroke.startY! + stroke.endY!) / 2;
        const rx = Math.abs((stroke.endX ?? 0) - (stroke.startX ?? 0)) / 2;
        const ry = Math.abs((stroke.endY ?? 0) - (stroke.startY ?? 0)) / 2;
        return (
          <Ellipse
            key={key}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            stroke={strokeColor}
            strokeWidth={effectiveSize}
            strokeOpacity={effectiveOpacity}
            fill="none"
          />
        );
      }

      if (stroke.tool === 'triangle') {
        const x1 = (stroke.startX! + stroke.endX!) / 2;
        const y1 = stroke.startY!;
        const x2 = stroke.startX!;
        const y2 = stroke.endY!;
        const x3 = stroke.endX!;
        const y3 = stroke.endY!;
        return (
          <Polygon
            key={key}
            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            stroke={strokeColor}
            strokeWidth={effectiveSize}
            strokeOpacity={effectiveOpacity}
            fill="none"
          />
        );
      }

      if (stroke.tool === 'arrow') {
        const dx = (stroke.endX ?? 0) - (stroke.startX ?? 0);
        const dy = (stroke.endY ?? 0) - (stroke.startY ?? 0);
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return null;
        const ux = dx / len;
        const uy = dy / len;
        const arrowLen = Math.min(20, len * 0.3);
        const ax1 = (stroke.endX ?? 0) - arrowLen * (ux - uy * 0.5);
        const ay1 = (stroke.endY ?? 0) - arrowLen * (uy + ux * 0.5);
        const ax2 = (stroke.endX ?? 0) - arrowLen * (ux + uy * 0.5);
        const ay2 = (stroke.endY ?? 0) - arrowLen * (uy - ux * 0.5);
        return (
          <G key={key}>
            <Line
              x1={stroke.startX}
              y1={stroke.startY}
              x2={stroke.endX}
              y2={stroke.endY}
              stroke={strokeColor}
              strokeWidth={effectiveSize}
              strokeOpacity={effectiveOpacity}
              strokeLinecap="round"
            />
            <Line
              x1={stroke.endX}
              y1={stroke.endY}
              x2={ax1}
              y2={ay1}
              stroke={strokeColor}
              strokeWidth={effectiveSize}
              strokeOpacity={effectiveOpacity}
              strokeLinecap="round"
            />
            <Line
              x1={stroke.endX}
              y1={stroke.endY}
              x2={ax2}
              y2={ay2}
              stroke={strokeColor}
              strokeWidth={effectiveSize}
              strokeOpacity={effectiveOpacity}
              strokeLinecap="round"
            />
          </G>
        );
      }

      // Ferramentas de traço livre
      const pathData = pointsToPath(stroke.points);
      if (!pathData) return null;

      if (stroke.tool === 'airbrush') {
        // Múltiplos paths com opacidade baixa para efeito de spray
        return (
          <G key={key}>
            {[...Array(4)].map((_, i) => (
              <Path
                key={i}
                d={pathData}
                stroke={strokeColor}
                strokeWidth={effectiveSize * (0.8 + i * 0.3)}
                strokeOpacity={effectiveOpacity * 0.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </G>
        );
      }

      return (
        <Path
          key={key}
          d={pathData}
          stroke={strokeColor}
          strokeWidth={effectiveSize}
          strokeOpacity={effectiveOpacity}
          fill="none"
          strokeLinecap={style.linecap}
          strokeLinejoin={style.linejoin}
        />
      );
    };

    return (
      <View
        style={[styles.container, { backgroundColor }]}
        {...panResponder.panHandlers}
        onLayout={(e) => {
          canvasLayout.current = e.nativeEvent.layout;
        }}
      >
        <Svg
          style={StyleSheet.absoluteFill}
          width="100%"
          height="100%"
        >
          {strokes.map((s) => renderStroke(s))}
          {currentStroke && renderStroke(currentStroke, true)}
        </Svg>
      </View>
    );
  }
);

export default DrawingCanvas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
