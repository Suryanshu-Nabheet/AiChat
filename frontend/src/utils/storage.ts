import type { AppSettings } from '../types/settings';
import type { ChatSummary } from '../types/chat';

const SETTINGS_KEY = 'ai-chat-settings';
const CHATS_KEY = 'ai-chat-history';

export const storage = {
  getSettings(): AppSettings | null {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AppSettings;
    } catch {
      return null;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  getChats(): ChatSummary[] {
    try {
      const stored = localStorage.getItem(CHATS_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as ChatSummary[];
    } catch {
      return [];
    }
  },

  saveChats(chats: ChatSummary[]): void {
    try {
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Failed to save chats:', error);
    }
  },

  clearAll(): void {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(CHATS_KEY);
  },
};

