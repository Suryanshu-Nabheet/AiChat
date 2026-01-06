# AI Chat

A production-ready, enterprise-level AI chat platform that supports multiple AI providers including OpenRouter, OpenAI, Anthropic (Claude), and Google (Gemini).

**Founder:** Suryanshu Nabheet

## 🚀 Features

- **Multi-Provider Support**: Connect to OpenRouter, OpenAI, Anthropic, or Google Gemini
- **Secure Backend**: Enterprise-grade security with rate limiting, brute-force protection, and input validation
- **Beautiful UI**: Modern, responsive interface with smooth animations and gradients
- **Chat History**: Persistent chat history with search and organization
- **Production Ready**: Fully typed, linted, and optimized for production

## 📁 Project Structure

```
ai-assistant/
├── frontend/              # Frontend application
│   ├── src/              # Source code
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
├── backend/              # Backend server
│   ├── src/              # Source code
│   ├── package.json      # Backend dependencies
│   └── tsconfig.json     # TypeScript config
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Backend will run on: http://localhost:3001

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse with configurable limits
- **Brute Force Protection**: Blocks IPs after failed attempts
- **Input Validation**: Sanitizes all user inputs
- **Secure Headers**: Helmet.js for security headers
- **CORS Protection**: Configured CORS for production
- **Input Sanitization**: Prevents injection attacks

## 🎨 UI Features

- Modern gradient designs
- Smooth animations and transitions
- Improved spacing and typography
- Better color contrast
- Copy-to-clipboard functionality
- Enhanced error messages
- Loading states
- Responsive design

## 📝 Configuration

### Frontend Environment Variables

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3001
```

### Backend Environment Variables

Create `backend/.env`:
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🚀 Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

### Backend

```bash
cd backend
npm run build
npm start
```

The production build will be in `backend/dist/`

## 🔐 Security Best Practices

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use `.env` files for configuration
3. **Rate Limiting**: Configured to prevent abuse
4. **Input Validation**: All inputs are validated and sanitized
5. **HTTPS**: Use HTTPS in production
6. **CORS**: Configure CORS properly for your domain

## 📦 Supported Providers

### OpenRouter
- Access to multiple models from various providers
- Get your API key at: https://openrouter.ai

### OpenAI
- GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- Get your API key at: https://platform.openai.com

### Anthropic (Claude)
- Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- Get your API key at: https://console.anthropic.com

### Google (Gemini)
- Gemini Pro, Gemini Pro Vision
- Get your API key at: https://makersuite.google.com/app/apikey

## 🛡️ Security Architecture

- **Backend API**: All AI requests go through secure backend
- **Rate Limiting**: Per-IP rate limits on all endpoints
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Secure error messages without exposing internals
- **Brute Force Protection**: Automatic IP blocking after failed attempts

## 📄 License

Copyright © 2024 Suryanshu Nabheet. All rights reserved.
