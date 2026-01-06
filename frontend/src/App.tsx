import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { SettingsModal } from "./components/SettingsModal";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import type { ChatMessage, ChatSummary } from "./types/chat";
import type { AppSettings } from "./types/settings";
import { AIService } from "./services/aiService";
import { storage } from "./utils/storage";
import { getDateGroup, generateChatTitle } from "./utils/dateUtils";
import { PROVIDERS } from "./types/settings";

export function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSummary[]>(() =>
    storage.getChats()
  );
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [showChatMenu, setShowChatMenu] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(() => {
    const saved = storage.getSettings();
    return !saved;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<AppSettings | null>(() =>
    storage.getSettings()
  );
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chatHistory.length > 0) {
      storage.saveChats(chatHistory);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [input]);

  const appendMessageToActiveChat = (message: ChatMessage) => {
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, message],
              // Update date group
              date: getDateGroup(new Date()),
            }
          : chat
      )
    );
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!settings || !settings.apiKey) {
      setError("Please configure your API settings first.");
      setShowSettings(true);
      return;
    }

    setError(null);

    // Create new chat if none exists
    let currentChatId = activeChat;
    if (!currentChatId) {
      const nextId = chatHistory.length
        ? Math.max(...chatHistory.map((c) => c.id)) + 1
        : 1;
      const newChat: ChatSummary = {
        id: nextId,
        title: generateChatTitle(trimmed),
        date: "Today",
        messages: [],
      };
      setChatHistory((prev) => [newChat, ...prev]);
      setActiveChat(nextId);
      currentChatId = nextId;
    }

    const baseTimestamp = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: `user-${baseTimestamp}`,
      role: "user",
      content: trimmed,
      timestamp: baseTimestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    appendMessageToActiveChat(userMessage);
    setInput("");
    setIsTyping(true);

    try {
      // Update chat title if it's the first message
      if (messages.length === 0) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, title: generateChatTitle(trimmed) }
              : chat
          )
        );
      }

      const response = await AIService.sendMessage({
        messages: [...messages, userMessage],
        config: {
          provider: settings.provider,
          apiKey: settings.apiKey,
          modelId: settings.modelId,
        },
      });

      if (response.error) {
        setError(response.error);
        setIsTyping(false);
        return;
      }

      const assistantTimestamp = new Date().toISOString();
      const assistantMessage: ChatMessage = {
        id: `assistant-${assistantTimestamp}`,
        role: "assistant",
        content: response.content,
        timestamp: assistantTimestamp,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, assistantMessage]);
      appendMessageToActiveChat(assistantMessage);
    } catch (err) {
      setIsTyping(false);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get response from AI";
      setError(errorMessage);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveChat(null);
    setError(null);
  };

  const loadChat = (chatId: number) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (!chat) return;

    setActiveChat(chatId);
    setMessages(chat.messages);
    setShowChatMenu(null);
    setError(null);
  };

  const deleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChat === chatId) {
      setMessages([]);
      setActiveChat(null);
    }
    setShowChatMenu(null);
  };

  const archiveChat = (_chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Archive functionality can be extended later
    setShowChatMenu(null);
  };

  const renameChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const chat = chatHistory.find((c) => c.id === chatId);
    if (!chat) return;

    const newName = window.prompt("Enter new chat name:", chat.title);
    if (newName && newName.trim()) {
      setChatHistory((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, title: newName.trim() } : c))
      );
    }
    setShowChatMenu(null);
  };

  const handleSettingsSave = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  // Update date groups for all chats
  const updatedChatHistory = chatHistory.map((chat) => {
    if (chat.messages.length === 0) return chat;
    const lastMessage = chat.messages[chat.messages.length - 1];
    return {
      ...chat,
      date: getDateGroup(lastMessage.timestamp),
    };
  });

  const currentModelName =
    settings?.modelId && settings.provider
      ? PROVIDERS[settings.provider]?.models.find(
          (m) => m.id === settings.modelId
        )?.name || settings.modelId
      : "Not configured";

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        chats={updatedChatHistory}
        activeChatId={activeChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewChat={startNewChat}
        onSelectChat={loadChat}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
        onArchiveChat={archiveChat}
        showChatMenu={showChatMenu}
        setShowChatMenu={setShowChatMenu}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
        currentSettings={settings}
      />

      <main className="flex-1 flex flex-col">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          modelName={currentModelName}
        />

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <section className="flex-1 overflow-y-auto bg-white">
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            onSuggestionClick={(suggestion) => {
              setInput(suggestion);
              // Optional: auto-submit
              // setTimeout(() => handleSend(),
            }}
          />
        </section>

        <ChatInput
          input={input}
          onChange={setInput}
          onSend={handleSend}
          textareaRef={textareaRef}
          disabled={!settings || !settings.apiKey}
        />
      </main>
    </div>
  );
}
