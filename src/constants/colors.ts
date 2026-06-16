// ============================================================
// Pik-arte — Sistema de Cores Completo
// ============================================================

export const APP_COLORS = {
  // Cores do tema do app
  background: '#0D0D0F',
  surface: '#1A1A1F',
  surfaceLight: '#252530',
  border: '#2E2E3A',
  primary: '#A855F7',
  primaryLight: '#C084FC',
  secondary: '#EC4899',
  accent: '#06B6D4',
  text: '#F8F8FF',
  textMuted: '#9090A0',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

// ============================================================
// Paleta de Cores para Desenho — Organizada por Família
// ============================================================

export interface ColorFamily {
  name: string;
  colors: string[];
}

export const COLOR_FAMILIES: ColorFamily[] = [
  {
    name: 'Pretos & Cinzas',
    colors: [
      '#000000', '#111111', '#222222', '#333333', '#444444',
      '#555555', '#666666', '#777777', '#888888', '#999999',
      '#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE', '#FFFFFF',
    ],
  },
  {
    name: 'Vermelhos',
    colors: [
      '#1A0000', '#330000', '#660000', '#990000', '#CC0000',
      '#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC',
      '#FF1744', '#D50000', '#B71C1C', '#C62828', '#E53935',
    ],
  },
  {
    name: 'Laranjas',
    colors: [
      '#1A0A00', '#331500', '#662B00', '#994000', '#CC5500',
      '#FF6A00', '#FF8C00', '#FFA500', '#FFB347', '#FFD700',
      '#FF6D00', '#FF9100', '#FFAB40', '#FFD180', '#FFE57F',
    ],
  },
  {
    name: 'Amarelos',
    colors: [
      '#1A1A00', '#333300', '#666600', '#999900', '#CCCC00',
      '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC',
      '#FFD600', '#FFEA00', '#FFF176', '#FFF9C4', '#FFFDE7',
    ],
  },
  {
    name: 'Verdes',
    colors: [
      '#001A00', '#003300', '#006600', '#009900', '#00CC00',
      '#00FF00', '#33FF33', '#66FF66', '#99FF99', '#CCFFCC',
      '#00C853', '#00E676', '#69F0AE', '#B9F6CA', '#1B5E20',
    ],
  },
  {
    name: 'Azuis',
    colors: [
      '#00001A', '#000033', '#000066', '#000099', '#0000CC',
      '#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF',
      '#2962FF', '#448AFF', '#82B1FF', '#0D47A1', '#1565C0',
    ],
  },
  {
    name: 'Ciano & Turquesa',
    colors: [
      '#001A1A', '#003333', '#006666', '#009999', '#00CCCC',
      '#00FFFF', '#33FFFF', '#66FFFF', '#99FFFF', '#CCFFFF',
      '#00BCD4', '#00E5FF', '#18FFFF', '#84FFFF', '#006064',
    ],
  },
  {
    name: 'Roxos & Violetas',
    colors: [
      '#0D001A', '#1A0033', '#330066', '#4D0099', '#6600CC',
      '#8000FF', '#9933FF', '#B366FF', '#CC99FF', '#E6CCFF',
      '#AA00FF', '#D500F9', '#E040FB', '#EA80FC', '#F3E5F5',
    ],
  },
  {
    name: 'Rosas & Magentas',
    colors: [
      '#1A0011', '#330022', '#660044', '#990066', '#CC0088',
      '#FF00AA', '#FF33BB', '#FF66CC', '#FF99DD', '#FFCCEE',
      '#E91E63', '#F06292', '#F48FB1', '#FCE4EC', '#C2185B',
    ],
  },
  {
    name: 'Marrons & Terrosos',
    colors: [
      '#1A0A00', '#2D1600', '#4A2200', '#6B3300', '#8B4513',
      '#A0522D', '#CD853F', '#D2691E', '#DEB887', '#F5DEB3',
      '#795548', '#8D6E63', '#A1887F', '#BCAAA4', '#EFEBE9',
    ],
  },
  {
    name: 'Pele & Nude',
    colors: [
      '#3B1A0A', '#5C2D0E', '#7D4020', '#A0522D', '#C68642',
      '#D2956A', '#E8B89A', '#F5CBA7', '#FAD7BD', '#FDE8D8',
      '#FDEBD0', '#FAEBD7', '#FAF0E6', '#FFF8DC', '#FFFAF0',
    ],
  },
  {
    name: 'Neons',
    colors: [
      '#FF0080', '#FF00FF', '#8000FF', '#0000FF', '#00FFFF',
      '#00FF80', '#00FF00', '#80FF00', '#FFFF00', '#FF8000',
      '#FF073A', '#39FF14', '#0FF0FC', '#FF6EC7', '#DFFF00',
    ],
  },
  {
    name: 'Pastéis',
    colors: [
      '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
      '#E8BAFF', '#FFBAEE', '#D4F1F4', '#F9E4B7', '#E8D5B7',
      '#C9F0FF', '#D4EDDA', '#FFF3CD', '#F8D7DA', '#E2D9F3',
    ],
  },
];

// Cores rápidas (quick access)
export const QUICK_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF6600', '#9900FF',
  '#FF69B4', '#8B4513', '#808080', '#FFD700', '#00CED1',
];
