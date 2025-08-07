"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ChatSidebar from "@/app/components/chatsidebar";
import ChatWindow from "@/app/components/chatwindow";
import { getGeminiResponse } from "@/lib/geminiClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Chat = {
  id: string;
  title: string;
  messages: { role: string; text: string }[];
  created_at: string;
};

const generateChatTitle = (text: string) => {
  return text.slice(0, 30) + (text.length > 30 ? "..." : "");
};

// Create new chat object
const createNewChat = (): Chat => ({
  id: `chat-${Date.now()}`,
  title: "New Chat",
  messages: [],
  created_at: new Date().toISOString(),
});

export default function Home() {
  const { user } = useUser();
  const userId = user?.id;

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chats from Supabase when user loads
  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("chats")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching chats:", error);
      } else if (data) {
        setChats(data.chats || []);
      }
    };

    fetchChats();
  }, [userId]);

  // Save updated chats to Supabase
  const saveChatsToDatabase = async (updatedChats: Chat[]) => {
    if (!userId) return;

    const { error } = await supabase.from("chats").upsert({
      user_id: userId,
      chats: updatedChats,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving chats:", error);
    }
  };

  // Delete a chat
  const handleDeleteChat = async (chatId: string) => {
    if (!userId) return;

    try {
      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      setChats(updatedChats);

      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }

      // Update database
      await saveChatsToDatabase(updatedChats);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Handle sending a message (user input)
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !userId) return;

    // If no current chat, create one
    let chat = currentChat;
    let isNewChat = false;

    if (!chat) {
      chat = createNewChat();
      setCurrentChat(chat);
      isNewChat = true;
    }

    const userMessage = { role: "user", text };
    const newMessages = [...chat.messages, userMessage];

    const updatedChat = {
      ...chat,
      title: chat.messages.length === 0 ? generateChatTitle(text) : chat.title,
      messages: newMessages,
    };

    setCurrentChat(updatedChat);
    setIsLoading(true);

    try {
      // Get AI response
      const botReply = await getGeminiResponse(newMessages);
      const finalMessages = [
        ...newMessages,
        { role: "Assistant", text: botReply },
      ];
      const finalChat = { ...updatedChat, messages: finalMessages };

      // Update chat list
      let updatedChats: Chat[];
      const existingIndex = chats.findIndex((c) => c.id === finalChat.id);

      if (existingIndex >= 0) {
        updatedChats = chats.map((c) =>
          c.id === finalChat.id ? finalChat : c
        );
      } else {
        updatedChats = [finalChat, ...chats];
      }

      // Save state and persist to DB
      setChats(updatedChats);
      setCurrentChat(finalChat);
      await saveChatsToDatabase(updatedChats);
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a brand new chat manually
  const handleNewChat = () => {
    const newChat = createNewChat();
    setCurrentChat(newChat);
  };

  // Select a chat from the sidebar
  const handleSelectChat = (chat: Chat) => {
    setCurrentChat(chat);
  };

  return (
    <main className="flex h-[87vh]">
      <ChatSidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        currentChatId={currentChat?.id}
      />
      <ChatWindow
        messages={currentChat?.messages || []}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </main>
  );
}
