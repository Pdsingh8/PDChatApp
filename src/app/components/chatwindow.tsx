import { useState, useRef, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";

type ChatWindowProps = {
  messages: { role: string; text: string }[];
  onSend: (text: string) => void;
  isLoading: boolean;
};

export default function ChatWindow({
  messages,
  onSend,
  isLoading,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <section className="flex-1 flex flex-col h-[80%] ">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-3 rounded ${
              msg.role === "user"
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-100 self-start text-left"
            }`}
          >
            {/* items-center justify-between mb-2 */}
            <div className="inline-flex items-center justify-between mb-2 text-xs text-orange-500 uppercase align-text-bottom">
              <ReactMarkdown>{msg.role}</ReactMarkdown>
            </div>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-400 italic">
            <BeatLoader color="#0c90ef" size={10} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white flex gap-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </section>
  );
}
