// ============================================================
// Pik-arte — Serviço de Integração com a API Gemini
// ============================================================

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-1.5-flash';

export interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
}

export interface DrawingTip {
  title: string;
  description: string;
  steps: string[];
  colorSuggestions?: string[];
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export interface SketchAnalysis {
  description: string;
  suggestions: string[];
  colorPalette: string[];
  nextSteps: string[];
  encouragement: string;
}

class GeminiService {
  private apiKey: string;
  private conversationHistory: GeminiMessage[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async callGemini(prompt: string, imageBase64?: string): Promise<string> {
    const url = `${GEMINI_API_BASE}/models/${MODEL}:generateContent?key=${this.apiKey}`;

    const parts: any[] = [{ text: prompt }];

    if (imageBase64) {
      parts.unshift({
        inline_data: {
          mime_type: 'image/png',
          data: imageBase64,
        },
      });
    }

    const body = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sem resposta';
  }

  // Dica de desenho baseada em tema
  async getDrawingTip(theme: string): Promise<DrawingTip> {
    const prompt = `Você é um professor de arte e design especialista em ajudar iniciantes.
    
Crie uma dica de desenho detalhada sobre o tema: "${theme}"

Responda APENAS com um JSON válido neste formato exato:
{
  "title": "Título da dica",
  "description": "Descrição breve e motivadora",
  "steps": ["Passo 1", "Passo 2", "Passo 3", "Passo 4", "Passo 5"],
  "colorSuggestions": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
  "difficulty": "Iniciante"
}

Seja encorajador, claro e específico. Use linguagem simples e acessível.`;

    try {
      const response = await this.callGemini(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as DrawingTip;
      }
    } catch (e) {
      console.error('Gemini tip error:', e);
    }

    // Fallback
    return {
      title: `Como desenhar: ${theme}`,
      description: 'Vamos aprender juntos! Siga os passos abaixo.',
      steps: [
        'Comece com formas básicas (círculos, quadrados, triângulos)',
        'Esboce levemente as linhas principais',
        'Adicione os detalhes gradualmente',
        'Aplique sombras e luzes',
        'Finalize com cores e ajustes',
      ],
      colorSuggestions: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
      difficulty: 'Iniciante',
    };
  }

  // Analisar esboço do usuário
  async analyzeSketch(imageBase64: string): Promise<SketchAnalysis> {
    const prompt = `Você é um crítico de arte gentil e encorajador, especializado em ajudar artistas iniciantes.

Analise este desenho/esboço e forneça feedback construtivo e motivador.

Responda APENAS com um JSON válido neste formato:
{
  "description": "Descrição do que você vê no desenho",
  "suggestions": ["Sugestão 1 para melhorar", "Sugestão 2", "Sugestão 3"],
  "colorPalette": ["#cor1", "#cor2", "#cor3", "#cor4"],
  "nextSteps": ["Próximo passo 1", "Próximo passo 2", "Próximo passo 3"],
  "encouragement": "Mensagem motivacional personalizada"
}

Seja sempre positivo, específico e útil. Foque no progresso, não na perfeição.`;

    try {
      const response = await this.callGemini(prompt, imageBase64);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as SketchAnalysis;
      }
    } catch (e) {
      console.error('Gemini analyze error:', e);
    }

    return {
      description: 'Seu desenho está tomando forma! Continue assim.',
      suggestions: [
        'Experimente variar a espessura dos traços',
        'Adicione mais detalhes nas áreas de interesse',
        'Tente usar cores complementares',
      ],
      colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
      nextSteps: [
        'Adicione sombras para dar profundidade',
        'Refine os contornos principais',
        'Experimente diferentes texturas',
      ],
      encouragement: 'Você está no caminho certo! Cada traço é um aprendizado. Continue praticando!',
    };
  }

  // Chat com o assistente de arte
  async chat(userMessage: string): Promise<string> {
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const systemContext = `Você é Pik, o assistente de arte do app Pik-arte. 
Você é especialista em desenho, design, pintura digital e criação artística.
Você ajuda artistas iniciantes e intermediários com dicas, técnicas e inspiração.
Seja sempre encorajador, claro e use linguagem simples em português brasileiro.
Quando sugerir cores, use códigos hex (#RRGGBB).
Mantenha respostas concisas (máximo 200 palavras).`;

    const historyText = this.conversationHistory
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'Usuário' : 'Pik'}: ${m.content}`)
      .join('\n');

    const prompt = `${systemContext}\n\nConversa:\n${historyText}\n\nResponda como Pik:`;

    try {
      const response = await this.callGemini(prompt);
      this.conversationHistory.push({ role: 'model', content: response });
      return response;
    } catch (e) {
      const fallback = 'Desculpe, não consegui me conectar agora. Verifique sua chave de API Gemini nas configurações.';
      this.conversationHistory.push({ role: 'model', content: fallback });
      return fallback;
    }
  }

  // Sugerir paleta de cores para um tema
  async suggestColorPalette(theme: string): Promise<string[]> {
    const prompt = `Sugira uma paleta de 8 cores harmoniosas para o tema: "${theme}"
    
Responda APENAS com um array JSON de códigos hex:
["#cor1", "#cor2", "#cor3", "#cor4", "#cor5", "#cor6", "#cor7", "#cor8"]

As cores devem ser variadas, harmoniosas e adequadas ao tema.`;

    try {
      const response = await this.callGemini(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as string[];
      }
    } catch (e) {
      console.error('Gemini palette error:', e);
    }

    return ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
  }

  // Gerar ideia de desenho
  async generateDrawingIdea(style?: string): Promise<string> {
    const styleHint = style ? ` no estilo ${style}` : '';
    const prompt = `Sugira uma ideia criativa e específica de desenho${styleHint} para um artista iniciante.
    
A ideia deve ser:
- Específica e detalhada (não genérica)
- Realizável para iniciantes
- Criativa e interessante
- Em 2-3 frases no máximo

Responda diretamente com a ideia, sem introdução.`;

    try {
      return await this.callGemini(prompt);
    } catch (e) {
      return 'Desenhe uma paisagem noturna com uma lua cheia refletida em um lago tranquilo, com silhuetas de árvores ao fundo.';
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

// Instância singleton
let geminiInstance: GeminiService | null = null;

export const getGeminiService = (apiKey: string): GeminiService => {
  if (!geminiInstance || (geminiInstance as any).apiKey !== apiKey) {
    geminiInstance = new GeminiService(apiKey);
  }
  return geminiInstance;
};

export default GeminiService;
