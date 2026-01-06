import { useEffect, useRef, useState } from "react";
import { Sparkles, User, Copy, Check, Terminal, Bot } from "lucide-react";
import type { ChatMessage } from "../types/chat";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const renderContent = (content: string, messageId: string) => {
    const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g);

    if (parts.length === 1) {
      return (
        <p className="text-[15px] leading-7 whitespace-pre-wrap">{content}</p>
      );
    }

    return parts.map((part, index) => {
      // The split logic:
      // index % 3 === 0: text
      // index % 3 === 1: language
      // index % 3 === 2: code

      if (index % 3 === 0) {
        if (!part.trim()) return null;
        return (
          <p
            key={index}
            className="text-[15px] leading-7 whitespace-pre-wrap mb-4 last:mb-0"
          >
            {part}
          </p>
        );
      }

      if (index % 3 === 1) return null; // Skip language, handled with code

      const language = parts[index - 1] || "text";
      const code = part;
      const codeId = `${messageId}-${index}`;

      return (
        <div
          key={index}
          className="my-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-900"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
            <span className="text-xs font-medium text-gray-400 lowercase flex items-center gap-2">
              <Terminal size={12} />
              {language}
            </span>
            <button
              onClick={() => copyToClipboard(code, codeId)}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            >
              {copiedId === codeId ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <code className="font-mono text-sm text-gray-200 whitespace-pre">
              {code}
            </code>
          </div>
        </div>
      );
    });
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
          <Bot size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-slate-800 tracking-tight">
          Welcome to CodeX
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-md text-center leading-relaxed">
          Your advanced AI coding companion. Ask me anything, generate code, or
          debug issues.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
          {[
            "Explain a complex concept",
            "Write a Python script",
            "Debug my React component",
            "Draft an email",
          ].map((suggestion, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-400/50 hover:shadow-md transition-all cursor-default group"
            >
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                "{suggestion}"
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const isLast = i === messages.length - 1;

        return (
          <div
            key={msg.id}
            className={`flex ${
              isUser ? "justify-end" : "justify-start"
            } animate-fade-in`}
            style={{ animationDelay: `${isLast ? 0 : 0}ms` }}
          >
            <div
              className={`flex gap-4 max-w-[85%] ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm mt-1 ${
                  isUser
                    ? "bg-gray-900 ring-2 ring-gray-100"
                    : "bg-gradient-to-br from-blue-600 to-indigo-600 ring-2 ring-blue-100"
                }`}
              >
                {isUser ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Sparkles size={16} className="text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 min-w-0 ${
                  isUser ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`relative inline-block text-left px-5 py-3.5 rounded-2xl shadow-sm ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white border border-gray-200/60 rounded-tl-sm"
                  }`}
                >
                  <div className={isUser ? "text-blue-50" : "text-slate-700"}>
                    {renderContent(msg.content, msg.id)}
                  </div>
                </div>

                {/* Footer/Timestamp */}
                <div
                  className={`mt-1.5 flex items-center gap-2 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-[10px] font-medium text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                      title="Copy full message"
                    >
                      {copiedId === msg.id ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="flex gap-4 max-w-[85%]">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm mt-1 ring-2 ring-blue-100">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}
