import type { KeyboardEvent, RefObject } from "react";
import { Send, Settings } from "lucide-react";

interface ChatInputProps {
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
  onSettingsClick?: () => void;
}

export function ChatInput({
  input,
  onChange,
  onSend,
  textareaRef,
  disabled = false,
  onSettingsClick,
}: ChatInputProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm pb-6 pt-2">
      <div className="max-w-4xl mx-auto px-4">
        <div
          onClick={() => textareaRef.current?.focus()}
          className="relative flex items-end gap-3 bg-white border border-gray-200 rounded-3xl p-4 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/50 focus-within:shadow-2xl focus-within:border-blue-500/50 transition-all duration-300 cursor-text group"
        >
          {disabled && (
            <button
              onClick={onSettingsClick}
              className="absolute left-4 top-4 text-gray-400 hover:text-blue-600 transition-colors"
              title="Configure settings"
            >
              <Settings size={20} />
            </button>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              disabled
                ? "Configure your API settings to start chatting..."
                : "Message AiChat..."
            }
            rows={1}
            disabled={disabled}
            className={`flex-1 resize-none outline-none px-2 py-3 text-base max-h-40 overflow-y-auto bg-transparent text-gray-700 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
              disabled ? "pl-12" : ""
            }`}
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent focusing the textarea when clicking the button
              onSend();
            }}
            disabled={!input.trim() || disabled}
            className={`p-3 rounded-2xl transition-all duration-200 flex-shrink-0 ${
              input.trim() && !disabled
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send
              size={20}
              className={input.trim() && !disabled ? "ml-0.5" : ""}
            />
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3 font-medium">
          AI Chat by{" "}
          <span className="font-semibold text-gray-600">Suryanshu Nabheet</span>{" "}
          • Secure & Private
        </p>
      </div>
    </div>
  );
}
