"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { HistoryDrawer } from "@/components/chat/HistoryDrawer";
import { LimitReachedCard } from "@/components/chat/LimitReachedCard";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { DeleteModal } from "@/components/chat/DeleteModal";
import { useChatStore } from "@/stores/useChatStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useToast } from "@/components/ui/Toast";
import { exportChatToPDF } from "@/lib/pdf-generator";

export default function ChatPage() {
  const router = useRouter();
  
  // Stores
  const profile = useProfileStore(s => s.profile);
  const { 
    sessions, activeSessionId, selectedModel, dailyUsage,
    setSelectedModel, setActiveSessionId, createNewSession, 
    addMessage, updateLastAssistantMessage, deleteSession, incrementDailyUsage, getRemainingChatsToday
  } = useChatStore();
  const isPremium = useSubscriptionStore(s => s.isPremium());

  // State
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  // Derived
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const remainingChats = getRemainingChatsToday(isPremium);
  const canChat = remainingChats > 0;

  // Auto-create session if none active on mount
  useEffect(() => {
    if (!activeSessionId) {
      createNewSession();
    }
  }, [activeSessionId, createNewSession]);

  // Abort controller for stopping generation
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isStreaming || !canChat) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
    }

    // Add user message
    addMessage(sessionId, {
      role: "user",
      content: text,
      timestamp: Date.now()
    });
    setInputValue("");
    setIsStreaming(true);

    // Initial empty assistant message
    addMessage(sessionId, {
      role: "assistant",
      content: "",
      timestamp: Date.now()
    });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
          model: selectedModel,
          profile: profile
        })
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        fullContent += decoder.decode(value, { stream: true });
        updateLastAssistantMessage(sessionId, fullContent);
      }
      
      incrementDailyUsage();
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.log("Stream stopped by user");
        return;
      }
      console.error("Chat error:", error);
      updateLastAssistantMessage(sessionId, "I apologize, but I encountered an error connecting to the service. Please try again.");
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const { showToast } = useToast();

  const handleDownloadPDF = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session && isPremium) {
      exportChatToPDF(session, profile);
      showToast("Chat exported as PDF.", "success");
    }
  };

  return (
    <div className="flex h-[calc(100vh-72px)] overflow-hidden">
      {/* Mobile History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onDeleteSession={(id) => setDeleteModalId(id)}
        onDownloadSession={handleDownloadPDF}
        isPremium={isPremium}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        onConfirm={() => {
          if (deleteModalId) {
            deleteSession(deleteModalId);
            showToast("Conversation deleted.", "info");
          }
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-bg-main relative">
        <ChatHeader
          modelValue={selectedModel}
          onModelChange={setSelectedModel}
          onNewChat={() => createNewSession()}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenMobileMenu={() => setIsHistoryOpen(true)}
        />
        
        <ChatMessages messages={messages} isStreaming={isStreaming} />

        {messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 mt-32 px-4">
            <div className="pointer-events-auto w-full">
              <SuggestedPrompts profile={profile} onSelect={handleSend} />
            </div>
          </div>
        )}

        {canChat ? (
          <ChatInput 
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSend(inputValue)}
            onStop={handleStop}
            isLoading={isStreaming}
          />
        ) : (
          <LimitReachedCard />
        )}
      </div>

      <ChatSidebar 
        usageCount={dailyUsage.count} 
        maxUsage={2} 
      />
    </div>
  );
}
