import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessage } from "@/types";
import { User, Copy, Check, Volume2, VolumeX, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isStreaming }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = useCallback(async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const handleSpeak = useCallback((id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown and emojis for speech synthesis
    const cleanText = text
      .replace(/[*_~`#|]/g, " ")
      .replace(/⚡|🚨|⚠️|✅|🤒|🍽️|⏳|🏥/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Detect if text contains Bengali characters
    const hasBangla = /[\u0980-\u09FF]/.test(cleanText);
    if (hasBangla) {
      utterance.lang = "bn-BD";
    } else {
      utterance.lang = "en-US";
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }, [speakingId]);

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const renderContent = (msg: ChatMessage) => {
    if (msg.role === "user") {
      return <div className="whitespace-pre-wrap">{msg.content}</div>;
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, children, ...props }) => (
            <p className="my-2 leading-relaxed" {...props}>{children}</p>
          ),
          li: ({ node, children, ...props }) => (
            <li className="ml-4 list-disc my-0.5" {...props}>{children}</li>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="my-2 flex flex-col gap-1" {...props}>{children}</ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="my-2 ml-4 list-decimal flex flex-col gap-1" {...props}>{children}</ol>
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-border-soft">
              <table className="w-full text-left border-collapse text-[14px]" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="bg-bg-soft border-b border-border-soft px-3.5 py-2.5 font-semibold text-text-primary text-[13px]" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-border-soft px-3.5 py-2.5 text-[13.5px] text-text-primary/90" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-text-primary" {...props} />
          ),
        }}
      >
        {msg.content}
      </ReactMarkdown>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-bg-main">
        <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand mb-4 shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h2 className="text-[20px] font-heading font-bold text-text-primary mb-2">How can I help you today?</h2>
        <p className="text-[14px] text-text-muted max-w-sm mx-auto">
          Describe your symptoms or ask a health-related question. I can also help you find medicines or doctors.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-bg-main flex flex-col gap-6">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const isCopied = copiedId === msg.id;
        const isSpeaking = speakingId === msg.id;
        const isLastMessage = index === messages.length - 1;
        const isThinking = !isUser && msg.content === "" && isStreaming && isLastMessage;

        return (
          <div key={msg.id} className={`group flex gap-3 max-w-[85%] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center shadow-xs ${
              isUser
                ? "bg-bg-soft text-text-muted"
                : "bg-brand text-white font-bold text-[12px]"
            }`}>
              {isUser ? <User className="w-4 h-4" /> : "Dr"}
            </div>

            {/* Bubble & Actions */}
            <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-[18px] text-[15px] leading-relaxed shadow-sm transition-all ${
                isUser
                  ? "bg-brand text-white rounded-tr-sm"
                  : "bg-white border border-border-soft text-text-primary rounded-tl-sm"
              }`}>
                {isThinking ? (
                  /* Premium Thinking Animation */
                  <div className="flex items-center gap-3 py-1.5 px-0.5">
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-brand/10 text-brand shrink-0">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-brand" style={{ animationDuration: "3s" }} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-brand tracking-tight">
                          Dr MediLink is thinking
                        </span>
                        <div className="flex items-center gap-1 ml-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDuration: "0.8s", animationDelay: "0ms" }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDuration: "0.8s", animationDelay: "160ms" }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDuration: "0.8s", animationDelay: "320ms" }}></span>
                        </div>
                      </div>
                      <span className="text-[11px] text-text-muted">
                        Reviewing medical guidelines & symptoms...
                      </span>
                    </div>
                  </div>
                ) : (
                  renderContent(msg)
                )}
              </div>

              {/* Message metadata & action buttons */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-text-muted">
                {msg.timestamp && (
                  <span>{formatTimestamp(msg.timestamp)}</span>
                )}

                {/* Assistant action buttons */}
                {!isUser && msg.content && (
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-[11px] text-text-muted hover:text-brand transition-colors px-1.5 py-0.5 rounded hover:bg-bg-soft"
                      aria-label="Copy message"
                      title="Copy response"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-brand" />
                          <span className="text-brand font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Listen / Read Aloud Button */}
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded hover:bg-bg-soft transition-colors ${
                        isSpeaking ? "text-brand font-medium" : "text-text-muted hover:text-brand"
                      }`}
                      aria-label={isSpeaking ? "Stop listening" : "Read aloud"}
                      title={isSpeaking ? "Stop speaking" : "Listen to response"}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-brand animate-pulse" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={endRef} className="h-2" />
    </div>
  );
};
