import { useEffect, useRef, useState } from 'react';
import { Sparkles, User, Copy, Check } from 'lucide-react';
import type { ChatMessage } from '../types/chat';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-600 mb-8">
            <Sparkles size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Welcome to AI Chat
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Connect with multiple AI providers
          </p>
          <p className="text-sm text-gray-500">
            Configure your settings to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-8">
      {messages.map((msg) => {
        const timestamp = new Date(msg.timestamp);
        const timeLabel = timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`mb-6 flex ${isUser ? 'justify-end' : 'justify-start'} group`}
          >
            <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isUser ? 'bg-gray-600' : 'bg-blue-600'
                }`}
              >
                {isUser ? (
                  <User size={20} className="text-white" />
                ) : (
                  <Sparkles size={20} className="text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="flex-1 relative">
                <div
                  className={`rounded-2xl px-5 py-4 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p
                      className={`text-xs ${
                        isUser ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {timeLabel}
                    </p>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded ${
                        isUser ? 'text-blue-100' : 'text-gray-400'
                      }`}
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="mb-6 flex justify-start">
          <div className="flex gap-4 max-w-[85%]">
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
              <div className="flex gap-2">
                <div
                  className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
