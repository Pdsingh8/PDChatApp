import { MdDelete } from "react-icons/md";

type Chat = {
  id: string;
  title: string;
  messages: { role: string; text: string }[];
  created_at: string;
};

type ChatSidebarProps = {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  currentChatId: string | null | undefined;
};

export default function ChatSidebar({
  chats,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  currentChatId,
}: ChatSidebarProps) {
  return (
    <aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r">
      <button
        onClick={onNewChat}
        className="w-full mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
      >
        + New Chat
      </button>
      <ul className="space-y-2 ">
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`p-3 rounded cursor-pointer flex items-center justify-between transition-colors${
              chat.id === currentChatId
                ? "bg-blue-200 font-semibold"
                : "hover:bg-gray-200"
            }`}
          >
            <div className="text-sm font-medium truncate  w-full">
              {chat.title || "Untitled Chat"}
            </div>
            <div>
              <MdDelete
                className="text-red-500 hover:text-red-700 cursor-pointer ml-2 shrink-0"
                onClick={(e) => {
                  e.stopPropagation(); //prevent selecting the chat
                  onDeleteChat(chat.id); //trigger delete
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      {chats.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No chats yet</p>
        </div>
      )}
    </aside>
  );
}
