import { useState, useRef, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { IoCopyOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import { FiDownload } from "react-icons/fi";
import ChartComponent from "./ChartComponent";

type ChatWindowProps = {
  messages: { role: string; text: string }[];
  onSend: (text: string) => void;
  isLoading: boolean;
};

// Extract JSON blocks from text
function extractJsonBlocks(text: string) {
  const jsonBlocks = [];
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
  let match;

  while ((match = jsonRegex.exec(text)) !== null) {
    const jsonText = match[1].trim();
    try {
      const parsed = JSON.parse(jsonText);
      // Validate if it's a chart/table
      if (
        (parsed.type &&
          ["line", "bar", "pie", "table"].includes(parsed.type) &&
          parsed.data) ||
        (parsed.type === "table" && parsed.headers && parsed.rows)
      ) {
        jsonBlocks.push({
          json: parsed,
          fullMatch: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  return jsonBlocks;
}

// Render mixed content (text + charts)
function renderMixedContent(text: string) {
  const jsonBlocks = extractJsonBlocks(text);

  if (jsonBlocks.length === 0) {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  }

  const parts = [];
  let lastIndex = 0;

  jsonBlocks.forEach((block, index) => {
    // Add text before this JSON block
    if (block.startIndex > lastIndex) {
      const textBefore = text.slice(lastIndex, block.startIndex).trim();
      if (textBefore) {
        parts.push(
          <div key={`text-${index}`} className="mb-4">
            <ReactMarkdown>{textBefore}</ReactMarkdown>
          </div>
        );
      }
    }

    // Add the chart
    parts.push(
      <div key={`chart-${index}`} className="mb-4">
        <ChartComponent chart={block.json} />
      </div>
    );

    lastIndex = block.endIndex;
  });

  // Add remaining text after last JSON block
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex).trim();
    if (textAfter) {
      parts.push(
        <div key="text-final" className="mb-4">
          <ReactMarkdown>{textAfter}</ReactMarkdown>
        </div>
      );
    }
  }

  return <div>{parts}</div>;
}
export default function ChatWindow({
  messages,
  onSend,
  isLoading,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      messages.forEach((msg) => {
        doc.text(`${msg.role}: ${msg.text}`, 20, yPosition);
        yPosition += 20;

        if (yPosition > 750) {
          doc.addPage();
          yPosition = 20;
        }
      });

      doc.save("chat.pdf");
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  return (
    <section className="flex-1 w-100 flex flex-col h-[80%] ">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-gray-800 justify-betwee">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`group max-w-[80%] p-3 rounded ${
              msg.role === "user"
                ? "bg-blue-100 dark:text-black self-end text-right pr-5 mb-1"
                : "bg-gray-100 self-start text-left dark:bg-slate-300 dark:text-black"
            }`}
          >
            {/* items-center justify-between mb-2 */}
            <div className="inline-flex items-center justify-between mb-2 text-xs text-orange-500 uppercase align-text-bottom group-hover:block">
              <ReactMarkdown>{msg.role}</ReactMarkdown>
            </div>

            {renderMixedContent(msg.text)}

            <div
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <IoCopyOutline
                onClick={() => handleCopy(msg.text, idx)}
                className="text-black text-lg mt-2  hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-gray-400 italic">
            <BeatLoader color="#0c90ef" size={10} />
          </div>
        )}

        {messages.length > 0 ? (
          <button
            onClick={exportToPDF}
            className="rounded-1xl hover:rounded-3xl text-black  w-7 h-9 flex justify-center items-center transition duration-200 ease-in-out"
          >
            <FiDownload className="hover:text-orange-600" />
          </button>
        ) : null}
        {/* <FiDownload className="hover:text-orange-600" /> */}

        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white flex gap-8"
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
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition dark:bg-blue-700 dark:hover:bg-blue-300 dark:hover:text-black "
        >
          Send
        </button>
        <button className="text-4xl">🌠</button>
      </form>
    </section>
  );
}
