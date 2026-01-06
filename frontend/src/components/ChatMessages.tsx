import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sparkles, User, Copy, Check, Bot } from "lucide-react";
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
                      : "bg-white border border-gray-200/60 rounded-tl-sm w-full"
                  }`}
                >
                  <div className={isUser ? "text-blue-50" : "text-slate-700"}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="prose prose-sm max-w-none prose-slate prose-pre:bg-[#1e1e1e] prose-pre:p-0 prose-pre:rounded-xl prose-pre:border prose-pre:border-gray-800 prose-code:text-red-500 prose-code:bg-red-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }: any) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const codeId = `${msg.id}-${Math.random()
                              .toString(36)
                              .substr(2, 9)}`;

                            if (!inline && match) {
                              return (
                                <div className="rounded-xl overflow-hidden my-4 border border-gray-800 bg-[#1e1e1e] not-prose">
                                  <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                                    <span className="text-xs font-medium text-gray-400 lowercase">
                                      {match[1]}
                                    </span>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          String(children).replace(/\n$/, ""),
                                          codeId
                                        )
                                      }
                                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
                                    >
                                      {copiedId === codeId ? (
                                        <>
                                          <Check
                                            size={12}
                                            className="text-green-400"
                                          />
                                          <span className="text-green-400">
                                            Copied
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={12} />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                      margin: 0,
                                      borderRadius: 0,
                                      padding: "1.5rem",
                                      backgroundColor: "#1e1e1e",
                                    }}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            }
                            return (
                              <code {...props} className={className}>
                                {children}
                              </code>
                            );
                          },
                          // Customize other elements if needed
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 my-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 my-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="my-1">{children}</li>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 leading-7">
                              {children}
                            </p>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
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
