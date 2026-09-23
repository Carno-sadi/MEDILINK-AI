import React, { useRef, useEffect, useState } from "react";
import { Send, Mic, MicOff, Square } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onStop?: () => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onStop,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }

          if (currentTranscript.trim()) {
            onChange(value ? `${value.trim()} ${currentTranscript.trim()}` : currentTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [value, onChange]);

  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
        return;
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        if (isListening) toggleListening();
        onSend();
      }
    }
  };

  const handleSendClick = () => {
    if (isLoading && onStop) {
      onStop();
      return;
    }
    if (isListening) toggleListening();
    onSend();
  };

  return (
    <div className="p-4 bg-white border-t border-border-soft shrink-0">
      <div className="max-w-[800px] mx-auto">
        {/* Listening banner badge */}
        {isListening && (
          <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px] animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-medium">Listening... speak into your microphone</span>
            </div>
            <button
              onClick={toggleListening}
              className="text-[11px] underline hover:text-red-900 font-semibold"
            >
              Stop
            </button>
          </div>
        )}

        <div
          className={`relative flex items-end gap-2 bg-bg-soft rounded-[18px] border p-1 transition-all shadow-sm ${
            isListening
              ? "border-red-400 ring-2 ring-red-100"
              : "border-border-soft focus-within:ring-2 focus-within:ring-brand focus-within:border-transparent"
          }`}
        >
          {/* Microphone toggle button */}
          <button
            onClick={toggleListening}
            className={`w-10 h-10 shrink-0 mb-1 ml-1 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-500 text-white shadow-sm hover:bg-red-600 animate-pulse"
                : "text-text-muted hover:text-brand hover:bg-brand-light"
            }`}
            title={isListening ? "Stop listening" : "Voice typing (Speech to Text)"}
            type="button"
            aria-label="Voice typing"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Message input */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening to your voice..." : "Describe symptoms or ask health questions..."}
            className="w-full bg-transparent border-none focus:outline-none resize-none py-3 px-2 text-[15px] max-h-[120px] text-text-primary placeholder:text-text-muted/70"
            rows={1}
            disabled={isLoading}
          />

          {/* Action button: Send or Stop Generating */}
          {isLoading ? (
            <button
              onClick={handleSendClick}
              className="w-10 h-10 shrink-0 mb-1 mr-1 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-xs"
              aria-label="Stop generating"
              title="Stop generating"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              onClick={handleSendClick}
              disabled={!value.trim()}
              className="w-10 h-10 shrink-0 mb-1 mr-1 rounded-full bg-brand text-white flex items-center justify-center disabled:opacity-50 disabled:bg-border-soft disabled:text-text-muted hover:bg-brand-dark transition-colors shadow-xs"
              aria-label="Send message"
              title="Send message"
            >
              <Send className="w-5 h-5 -ml-0.5" />
            </button>
          )}
        </div>

        <div className="text-center mt-2 text-[12px] text-text-muted">
          Dr MediLink is an AI health companion. In medical emergencies, immediately call 999.
        </div>
      </div>
    </div>
  );
};
