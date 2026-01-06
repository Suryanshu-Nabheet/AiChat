import type { AppSettings } from '../types/settings';
import type { ChatMessage } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ChatRequest {
  messages: ChatMessage[];
  config: {
    provider: AppSettings['provider'];
    apiKey: string;
    modelId: string;
  };
}

export interface ChatResponse {
  content: string;
  error?: string;
}

export class AIService {
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { messages, config } = request;

    if (!config.apiKey) {
      return { content: '', error: 'API key is required. Please configure your settings.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { content: data.content || '' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { content: '', error: `API Error: ${message}` };
    }
  }
}
