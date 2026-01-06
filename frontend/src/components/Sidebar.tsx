import type { Dispatch, SetStateAction } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  MoreVertical,
  Edit3,
  Trash2,
  Archive,
  Settings,
  User,
} from 'lucide-react';
import type { ChatSummary } from '../types/chat';

interface SidebarProps {
  isOpen: boolean;
  chats: ChatSummary[];
  activeChatId: number | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
  onRenameChat: (id: number, e: React.MouseEvent) => void;
  onDeleteChat: (id: number, e: React.MouseEvent) => void;
  onArchiveChat: (id: number, e: React.MouseEvent) => void;
  showChatMenu: number | null;
  setShowChatMenu: Dispatch<SetStateAction<number | null>>;
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({
  isOpen,
  chats,
  activeChatId,
  searchQuery,
  onSearchChange,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onArchiveChat,
  showChatMenu,
  setShowChatMenu,
  showSettings,
  setShowSettings,
}: SidebarProps) {
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedChats = filteredChats.reduce<Record<string, ChatSummary[]>>((acc, chat) => {
    if (!acc[chat.date]) acc[chat.date] = [];
    acc[chat.date].push(chat);
    return acc;
  }, {});

  return (
    <aside
      className={`${
        isOpen ? 'w-72' : 'w-0'
      } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm">New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <div className="relative bg-gray-50 border border-gray-200 rounded-lg">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-transparent outline-none text-sm focus:ring-1 focus:ring-blue-500 rounded-lg"
            />
          </div>
        </div>

        {Object.keys(groupedChats).length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedChats).map((dateGroup) => (
              <div key={dateGroup}>
                <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
                  {dateGroup}
                </div>
                <div className="space-y-1">
                  {groupedChats[dateGroup].map((chat) => (
                    <div key={chat.id} className="relative group">
                      <div
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                          activeChatId === chat.id
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'bg-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <MessageSquare
                              size={16}
                              className={`flex-shrink-0 ${
                                activeChatId === chat.id ? 'text-blue-600' : 'text-gray-400'
                              }`}
                            />
                            <span className="text-sm text-gray-700 truncate font-medium">
                              {chat.title}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowChatMenu(showChatMenu === chat.id ? null : chat.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded transition-opacity"
                          >
                            <MoreVertical size={16} className="text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {showChatMenu === chat.id && (
                        <div className="absolute right-2 top-14 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-20 min-w-[180px]">
                          <button
                            onClick={(e) => onRenameChat(chat.id, e)}
                            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                          >
                            <Edit3 size={16} className="text-gray-500" />
                            Rename
                          </button>
                          <button
                            onClick={(e) => onArchiveChat(chat.id, e)}
                            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                          >
                            <Archive size={16} className="text-gray-500" />
                            Archive
                          </button>
                          <div className="border-t border-gray-200 my-1" />
                          <button
                            onClick={(e) => onDeleteChat(chat.id, e)}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 flex items-center gap-3 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-1">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors"
        >
          <Settings size={20} className="text-gray-600" />
          <span className="text-sm text-gray-700">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <span className="text-sm text-gray-700 font-medium">Suryanshu Nabheet</span>
        </button>
      </div>
    </aside>
  );
}
