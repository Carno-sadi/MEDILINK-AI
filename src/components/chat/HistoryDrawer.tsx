import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { ChatSession } from "@/types";
import { MessageSquare, Trash2, Download } from "lucide-react";
import { TextLink } from "@/components/ui/TextLink";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onDownloadSession: (id: string) => void;
  isPremium: boolean;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onDownloadSession,
  isPremium
}) => {
  // Free plan only sees last 3
  const displaySessions = isPremium ? sessions : sessions.slice(0, 3);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Chat History">
      <div className="flex flex-col h-full bg-bg-main p-4">
        {!isPremium && sessions.length > 3 && (
          <div className="mb-4 p-3 bg-accent-soft rounded-lg text-[13px] text-text-primary border border-accent/20">
            <strong>Free Plan limits history to the last 3 chats.</strong> Upgrade to Premium to unlock your full history and PDF exports.
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {displaySessions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h4 className="font-bold text-[16px] text-text-primary mb-1">
                No conversations yet
              </h4>
              <p className="text-[13px] text-text-muted">
                Start a new chat and it will appear here.
              </p>
            </div>
          ) : (
            displaySessions.map(session => (
              <div 
                key={session.id} 
                className={`group flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                  activeSessionId === session.id 
                    ? "bg-white border-brand shadow-sm" 
                    : "bg-white border-border-soft hover:border-brand-light"
                }`}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activeSessionId === session.id ? "bg-brand-light text-brand" : "bg-bg-soft text-text-muted"
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-[14px] font-semibold text-text-primary truncate">{session.title}</div>
                    <div className="text-[12px] text-text-muted">
                      {new Date(session.createdAt).toLocaleDateString()} · {session.modelUsed === "med1-pro" ? "Pro" : "Flash"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {isPremium && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDownloadSession(session.id); }}
                      className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-brand hover:bg-brand-light rounded-md"
                      aria-label="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-emergency hover:bg-emergency-soft rounded-md"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
};
