// ============================================================
// Pik-arte — Ferramentas de Desenho
// ============================================================

export type ToolType =
  | 'pen'
  | 'pencil'
  | 'brush'
  | 'marker'
  | 'calligraphy'
  | 'airbrush'
  | 'eraser'
  | 'fill'
  | 'line'
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'arrow'
  | 'text'
  | 'select'
  | 'move';

export interface Tool {
  id: ToolType;
  label: string;
  icon: string;
  category: 'draw' | 'shape' | 'edit';
  defaultSize: number;
  defaultOpacity: number;
  description: string;
}

export const TOOLS: Tool[] = [
  // Ferramentas de Desenho
  {
    id: 'pen',
    label: 'Caneta',
    icon: '✒️',
    category: 'draw',
    defaultSize: 3,
    defaultOpacity: 1,
    description: 'Traço preciso e fino',
  },
  {
    id: 'pencil',
    label: 'Lápis',
    icon: '✏️',
    category: 'draw',
    defaultSize: 4,
    defaultOpacity: 0.85,
    description: 'Traço natural de lápis',
  },
  {
    id: 'brush',
    label: 'Pincel',
    icon: '🖌️',
    category: 'draw',
    defaultSize: 12,
    defaultOpacity: 0.8,
    description: 'Pincel suave e expressivo',
  },
  {
    id: 'marker',
    label: 'Marcador',
    icon: '🖊️',
    category: 'draw',
    defaultSize: 10,
    defaultOpacity: 0.9,
    description: 'Marcador com borda definida',
  },
  {
    id: 'calligraphy',
    label: 'Caligrafia',
    icon: '🖋️',
    category: 'draw',
    defaultSize: 8,
    defaultOpacity: 1,
    description: 'Traço caligráfico elegante',
  },
  {
    id: 'airbrush',
    label: 'Aerógrafo',
    icon: '💨',
    category: 'draw',
    defaultSize: 20,
    defaultOpacity: 0.4,
    description: 'Spray suave e difuso',
  },
  // Ferramentas de Edição
  {
    id: 'eraser',
    label: 'Borracha',
    icon: '🧹',
    category: 'edit',
    defaultSize: 15,
    defaultOpacity: 1,
    description: 'Apagar traços',
  },
  {
    id: 'fill',
    label: 'Balde',
    icon: '🪣',
    category: 'edit',
    defaultSize: 1,
    defaultOpacity: 1,
    description: 'Preencher área com cor',
  },
  // Formas
  {
    id: 'line',
    label: 'Linha',
    icon: '📏',
    category: 'shape',
    defaultSize: 3,
    defaultOpacity: 1,
    description: 'Linha reta',
  },
  {
    id: 'rect',
    label: 'Retângulo',
    icon: '⬜',
    category: 'shape',
    defaultSize: 2,
    defaultOpacity: 1,
    description: 'Retângulo / Quadrado',
  },
  {
    id: 'circle',
    label: 'Círculo',
    icon: '⭕',
    category: 'shape',
    defaultSize: 2,
    defaultOpacity: 1,
    description: 'Círculo / Elipse',
  },
  {
    id: 'triangle',
    label: 'Triângulo',
    icon: '🔺',
    category: 'shape',
    defaultSize: 2,
    defaultOpacity: 1,
    description: 'Triângulo',
  },
  {
    id: 'arrow',
    label: 'Seta',
    icon: '➡️',
    category: 'shape',
    defaultSize: 3,
    defaultOpacity: 1,
    description: 'Seta direcional',
  },
  {
    id: 'text',
    label: 'Texto',
    icon: '🔤',
    category: 'edit',
    defaultSize: 18,
    defaultOpacity: 1,
    description: 'Inserir texto',
  },
];

export const BRUSH_SIZES = [1, 2, 3, 5, 8, 12, 18, 25, 35, 50];

export const OPACITY_LEVELS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
