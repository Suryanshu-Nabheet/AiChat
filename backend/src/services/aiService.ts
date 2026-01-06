import type { ChatMessage } from '../types/index.js';

export type AIProvider = 'openrouter' | 'openai' | 'anthropic' | 'google';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  modelId: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  config: AIConfig;
}

export interface ChatResponse {
  content: string;
  error?: string;
}

const DEFAULT_SYSTEM_PROMPT = `You are an expert AI assistant designed to help users with a wide range of tasks. You are knowledgeable, helpful, and provide accurate, well-structured responses. Always aim to be clear, concise, and professional while maintaining a friendly and approachable tone.

Key guidelines:
- Provide accurate and up-to-date information
- Break down complex topics into understandable explanations
- When uncertain, acknowledge limitations and suggest reliable sources
- Format responses clearly with proper structure when appropriate
- Be concise but thorough
- Adapt your communication style to match the user's needs and context`;

export class AIService {
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { messages, config } = request;

    if (!config.apiKey) {
      return { content: '', error: 'API key is required' };
    }

    try {
      switch (config.provider) {
        case 'openrouter':
          return await this.callOpenRouter(messages, config);
        case 'openai':
          return await this.callOpenAI(messages, config);
        case 'anthropic':
          return await this.callAnthropic(messages, config);
        case 'google':
          return await this.callGoogle(messages, config);
        default:
          return { content: '', error: 'Unsupported provider' };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { content: '', error: `API Error: ${message}` };
    }
  }

  private static async callOpenRouter(
    messages: ChatMessage[],
    config: AIConfig,
  ): Promise<ChatResponse> {
    const formattedMessages = this.formatMessages(messages, DEFAULT_SYSTEM_PROMPT);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'HTTP-Referer': 'https://ai-chat.app',
        'X-Title': 'AI Chat',
      },
      body: JSON.stringify({
        model: config.modelId,
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || '' };
  }

  private static async callOpenAI(
    messages: ChatMessage[],
    config: AIConfig,
  ): Promise<ChatResponse> {
    const formattedMessages = this.formatMessages(messages, DEFAULT_SYSTEM_PROMPT);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.modelId,
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || '' };
  }

  private static async callAnthropic(
    messages: ChatMessage[],
    config: AIConfig,
  ): Promise<ChatResponse> {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.modelId,
        max_tokens: 4096,
        system: DEFAULT_SYSTEM_PROMPT,
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { content: data.content[0]?.text || '' };
  }

  private static async callGoogle(
    messages: ChatMessage[],
    config: AIConfig,
  ): Promise<ChatResponse> {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.modelId}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedMessages,
          systemInstruction: {
            parts: [{ text: DEFAULT_SYSTEM_PROMPT }],
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { content: data.candidates[0]?.content?.parts[0]?.text || '' };
  }

  private static formatMessages(
    messages: ChatMessage[],
    systemPrompt: string,
  ): Array<{ role: string; content: string }> {
    const formatted: Array<{ role: string; content: string }> = [];

    formatted.push({ role: 'system', content: systemPrompt });

    return formatted.concat(
      messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    );
  }
}

