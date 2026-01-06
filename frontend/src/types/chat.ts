export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** ISO timestamp string for easier serialization */
  timestamp: string;
}

export interface ChatSummary {
  id: number;
  title: string;
  /** Group label like 'Today', 'Previous 7 Days', etc. */
  date: string;
  messages: ChatMessage[];
}


