# 🎨 Pik-arte

> **App de desenho e criação de imagens com IA Gemini — para artistas e designers de todos os níveis.**

---

## ✨ Funcionalidades

### 🖌️ Ferramentas de Desenho
| Ferramenta | Descrição |
|---|---|
| **Caneta** | Traço preciso e fino, ideal para contornos |
| **Lápis** | Traço natural com textura de lápis |
| **Pincel** | Pincel suave e expressivo para pintura |
| **Marcador** | Traço com borda definida e opaco |
| **Caligrafia** | Traço caligráfico elegante |
| **Aerógrafo** | Spray suave e difuso para gradientes |
| **Borracha** | Apagar traços com precisão |

### ⬜ Formas Geométricas
- Linha reta, Retângulo, Círculo/Elipse, Triângulo, Seta

### 🎨 Sistema de Cores Completo
- **13 famílias de cores** organizadas: Pretos, Vermelhos, Laranjas, Amarelos, Verdes, Azuis, Ciano, Roxos, Rosas, Marrons, Pele, Neons e Pastéis
- **Cores rápidas** de acesso imediato
- **Entrada por código Hex** (#RRGGBB)
- **Gradientes populares** pré-definidos
- **Histórico de cores** recentes

### 🤖 Assistente IA — Pik (Gemini)
- **Chat interativo** com especialista em arte
- **Dicas de desenho** personalizadas por tema
- **Sugestão de paletas** de cores harmoniosas
- **Geração de ideias** criativas de desenho
- **Análise de esboços** com feedback construtivo

### 📱 Interface Adaptativa
- Layout otimizado para **qualquer tela Android**
- **Barra lateral direita** com ferramentas rápidas e cores
- **Barra superior** com ações e ferramenta atual
- **Tela de carregamento** animada com logo

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app no seu Android (para testar)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/rafaelsemenciosilva-boop/Pik-arte.git
cd Pik-arte

# Instalar dependências
npm install --legacy-peer-deps

# Rodar o projeto
npx expo start
```

### Rodar no Android
1. Instale o **Expo Go** na Play Store
2. Execute `npx expo start`
3. Escaneie o QR Code com o Expo Go

### Build APK (Produção)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Build para Android
eas build --platform android --profile preview
```

---

## 🔑 Configurar API Gemini

1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Faça login com sua conta Google
3. Crie uma nova chave de API (gratuita)
4. No app, toque em **✨** → Configurações → Cole sua chave

---

## 📁 Estrutura do Projeto

```
Pik-arte/
├── App.tsx                    # Entrada principal
├── app.json                   # Configurações Expo/Android
├── assets/
│   ├── logo.png               # Logo do app
│   └── splash-bg.png          # Fundo da tela de carregamento
└── src/
    ├── screens/
    │   ├── SplashScreen.tsx   # Tela de carregamento animada
    │   ├── DrawingScreen.tsx  # Tela principal de desenho
    │   └── SettingsScreen.tsx # Configurações
    ├── components/
    │   ├── DrawingCanvas.tsx  # Canvas SVG de desenho
    │   ├── ToolBar.tsx        # Barra de ferramentas
    │   ├── ColorPicker.tsx    # Seletor de cores completo
    │   └── AIAssistant.tsx    # Chat com Gemini IA
    ├── constants/
    │   ├── colors.ts          # Sistema de cores (13 famílias)
    │   └── tools.ts           # Definição das ferramentas
    └── utils/
        └── geminiService.ts   # Integração com API Gemini
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **React Native + Expo** | Framework mobile |
| **TypeScript** | Tipagem estática |
| **react-native-svg** | Canvas de desenho vetorial |
| **Google Gemini API** | Assistente de arte IA |
| **AsyncStorage** | Persistência local |
| **Expo Haptics** | Feedback tátil |

---

## 📄 Licença

MIT © 2025 Pik-arte
