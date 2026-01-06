import { Menu, Zap } from 'lucide-react';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  modelName?: string;
  providerName?: string;
}

export function ChatHeader({ onToggleSidebar, modelName, providerName }: ChatHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center px-6 gap-4 bg-white">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg transition-colors"
      >
        <Menu size={22} className="text-gray-600" />
      </button>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-blue-600">AI Chat</span>
        </h1>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          {modelName && providerName ? (
            <>
              <Zap size={12} className="text-blue-500" />
              {providerName} • {modelName}
            </>
          ) : (
            'Configure settings to start chatting'
          )}
        </p>
      </div>
    </header>
  );
}
