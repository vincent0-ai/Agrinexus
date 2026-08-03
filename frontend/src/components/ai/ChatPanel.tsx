import { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, Bot, User, Copy, RotateCcw, Trash2, X,
  TrendingUp, CloudSun, MessageSquare, Check,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { GREEN, AMBER } from "@/utils/constants";
import { useAIChat, type DisplayMessage } from "@/hooks/useAIChat";
import { suggestedPrompts } from "@/data/aiData";
import type { AIProvider, AIContext } from "@/services/aiService";

const PROVIDER_CONFIG = {
  auto: { name: "AgriNexus AI Engine", color: "#10B981", gradient: "from-emerald-500 to-teal-400" },
};

const CONTEXT_CONFIG: { id: AIContext; label: string; Icon: React.ElementType }[] = [
  { id: "general", label: "General", Icon: MessageSquare },
  { id: "market", label: "Market", Icon: TrendingUp },
  { id: "weather", label: "Weather", Icon: CloudSun },
];

interface ChatPanelProps {
  defaultContext?: AIContext;
  compact?: boolean;
  onClose?: () => void;
  className?: string;
  initialPrompt?: { prompt: string; context: AIContext; key?: number } | null;
}

export function ChatPanel({ defaultContext = "general", compact = false, onClose, className, initialPrompt }: ChatPanelProps) {
  const {
    messages, loading, provider, context,
    scrollRef, sendMessage, clearHistory, switchContext,
  } = useAIChat(defaultContext);

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Trigger quick action prompt if provided
  useEffect(() => {
    if (initialPrompt?.prompt) {
      switchContext(initialPrompt.context);
      sendMessage(initialPrompt.prompt);
    }
  }, [initialPrompt?.key]);


  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const providerCfg = PROVIDER_CONFIG.auto;
  const prompts = suggestedPrompts[context] ?? suggestedPrompts.general;

  return (
    <div className={cn(
      "flex flex-col bg-card rounded-2xl border border-border overflow-hidden",
      compact ? "h-[520px]" : "h-full",
      className
    )}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-gradient-to-r from-card to-muted/30">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br",
              providerCfg.gradient
            )}>
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                AgriNexus AI
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Smart Agricultural Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clearHistory}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Context Tabs */}
        <div className="flex gap-1">
          {CONTEXT_CONFIG.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => switchContext(id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all",
                context === id
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              style={context === id ? { background: GREEN } : {}}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 [scrollbar-width:thin]">
        {messages.length === 0 ? (
          <EmptyState prompts={prompts} onPromptClick={(p) => { setInput(""); sendMessage(p); }} />
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} providerColor={providerCfg.color} />
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br", providerCfg.gradient)}>
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts (shown when not too many messages) */}
      {messages.length > 0 && messages.length < 4 && !loading && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {prompts.slice(0, 3).map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all whitespace-nowrap flex-shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 p-3 border-t border-border bg-card">
        <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${context === "market" ? "market trends" : context === "weather" ? "weather & farming" : "farming"}...`}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-snug max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
              input.trim() && !loading
                ? "text-white hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            style={input.trim() && !loading ? { background: GREEN } : {}}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({ message, providerColor }: { message: DisplayMessage; providerColor: string }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
        isUser ? "" : "bg-gradient-to-br"
      )}
        style={isUser ? { background: GREEN } : { background: `linear-gradient(135deg, ${providerColor}, ${providerColor}aa)` }}
      >
        {isUser
          ? <User className="w-3.5 h-3.5 text-white" />
          : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "max-w-[80%] group",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm text-white"
            : "rounded-tl-sm bg-muted text-foreground"
        )}
          style={isUser ? { background: GREEN } : {}}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <MarkdownContent content={message.content} />
          )}
        </div>

        {/* Meta row */}
        <div className={cn(
          "flex items-center gap-2 mt-1 px-1",
          isUser ? "justify-end" : "justify-start"
        )}>
          <span className="text-[9px] text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {message.provider && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              {message.provider}
            </span>
          )}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-foreground transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Markdown Renderer ─────────────────────────────────────────────────────────

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown: bold, bullet lists, numbered lists, line breaks
  const lines = content.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;

        // Bold with **
        let html = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
          .replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>');

        // Heading check (##)
        if (line.startsWith("## ")) {
          return <p key={i} className="font-bold text-sm mt-2" dangerouslySetInnerHTML={{ __html: html.slice(3) }} />;
        }
        if (line.startsWith("# ")) {
          return <p key={i} className="font-bold text-base mt-2" dangerouslySetInnerHTML={{ __html: html.slice(2) }} />;
        }

        // Bullet list
        if (line.match(/^[-•] /)) {
          return (
            <div key={i} className="flex items-start gap-1.5 pl-1">
              <span className="w-1 h-1 rounded-full bg-current mt-2 flex-shrink-0 opacity-50" />
              <span dangerouslySetInnerHTML={{ __html: html.replace(/^[-•] /, "") }} />
            </div>
          );
        }

        // Numbered list
        const numMatch = line.match(/^(\d+)\.\s/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-1.5 pl-1">
              <span className="text-[10px] font-bold opacity-60 mt-0.5 flex-shrink-0 w-3">{numMatch[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: html.replace(/^\d+\.\s/, "") }} />
            </div>
          );
        }

        return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ prompts, onPromptClick }: { prompts: string[]; onPromptClick: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: GREEN + "15" }}>
        <Sparkles className="w-7 h-7" style={{ color: GREEN }} />
      </div>
      <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        How can I help your farm?
      </h3>
      <p className="text-xs text-muted-foreground mb-5 max-w-[260px]">
        Ask me about market prices, weather forecasts, crop planning, or anything farming-related.
      </p>
      <div className="grid grid-cols-2 gap-2 w-full max-w-[320px]">
        {prompts.slice(0, 4).map((p) => (
          <button
            key={p}
            onClick={() => onPromptClick(p)}
            className="text-[11px] text-left px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-muted hover:border-foreground/15 text-muted-foreground hover:text-foreground transition-all leading-snug"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
