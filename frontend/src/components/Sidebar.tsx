import type { Dispatch, SetStateAction } from "react";
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
  Sparkles,
} from "lucide-react";
import type { ChatSummary } from "../types/chat";

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
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = filteredChats.reduce<Record<string, ChatSummary[]>>(
    (acc, chat) => {
      if (!acc[chat.date]) acc[chat.date] = [];
      acc[chat.date].push(chat);
      return acc;
    },
    {}
  );

  return (
    <aside
      className={`${
        isOpen ? "w-[280px] translate-x-0" : "w-0 -translate-x-full"
      } bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col z-20 h-full overflow-hidden`}
    >
      <div className="p-4 pt-6">
        <button
          onClick={onNewChat}
          className="group w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus
            size={20}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="text-sm font-semibold tracking-wide">New Chat</span>
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6">
        {Object.keys(groupedChats).length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 mb-4">
              <MessageSquare size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No conversations
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          Object.keys(groupedChats).map((dateGroup) => (
            <div key={dateGroup} className="px-2">
              <div className="text-[11px] font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">
                {dateGroup}
              </div>
              <div className="space-y-0.5">
                {groupedChats[dateGroup].map((chat) => (
                  <div key={chat.id} className="relative group/item">
                    <div
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full text-left px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${
                        activeChatId === chat.id
                          ? "bg-white shadow-sm border-gray-200/60"
                          : "hover:bg-gray-200/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Sparkles
                            size={16}
                            className={`flex-shrink-0 ${
                              activeChatId === chat.id
                                ? "text-blue-600"
                                : "text-gray-400 group-hover/item:text-gray-500"
                            }`}
                          />
                          <span className="text-sm text-gray-700 truncate font-medium group-hover/item:text-gray-900 transition-colors">
                            {chat.title}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowChatMenu(
                              showChatMenu === chat.id ? null : chat.id
                            );
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            showChatMenu === chat.id
                              ? "opacity-100 bg-gray-200"
                              : "opacity-0 group-hover/item:opacity-100 hover:bg-gray-200"
                          }`}
                        >
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {showChatMenu === chat.id && (
                      <div className="absolute right-2 top-10 bg-white border border-gray-100/50 rounded-xl shadow-xl shadow-gray-200/50 py-1.5 z-30 min-w-[160px] animate-fade-in backdrop-blur-xl">
                        <button
                          onClick={(e) => onRenameChat(chat.id, e)}
                          className="w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors mx-1 rounded-lg"
                        >
                          <Edit3 size={14} />
                          Rename
                        </button>
                        <button
                          onClick={(e) => onArchiveChat(chat.id, e)}
                          className="w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors mx-1 rounded-lg"
                        >
                          <Archive size={14} />
                          Archive
                        </button>
                        <div className="h-px bg-gray-100 my-1 mx-2" />
                        <button
                          onClick={(e) => onDeleteChat(chat.id, e)}
                          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2.5 transition-colors mx-1 rounded-lg"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm space-y-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100/80 transition-colors text-gray-600 hover:text-gray-900"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <User size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              Suryanshu Nabheet
            </div>
            <div className="text-[10px] text-gray-500 truncate">Founder</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
