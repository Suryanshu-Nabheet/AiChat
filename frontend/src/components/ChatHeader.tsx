import { Menu, Zap, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  modelName?: string;
}

export function ChatHeader({ onToggleSidebar, modelName }: ChatHeaderProps) {
  return (
    <header className="h-16 flex items-center px-6 gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
      <button
        onClick={onToggleSidebar}
        className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100/80 hover:text-gray-900 transition-all active:scale-95"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            AiChat
          </h1>
        </div>

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {modelName ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
            <Zap size={12} className="text-blue-500 fill-blue-500" />
            <span className="text-xs font-medium text-gray-600">
              {modelName}
            </span>
          </div>
        ) : (
          <span className="text-xs font-medium text-gray-400">
            Select a model
          </span>
        )}
      </div>
    </header>
  );
}
