import { useState, useCallback, useRef, useEffect } from "react";
import {
  sendChatMessage,
  type AIProvider,
  type AIContext,
  type ChatMessage,
} from "@/services/aiService";

export interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
  timestamp: Date;
  context?: AIContext;
}

export function useAIChat(defaultContext: AIContext = "general") {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState<AIProvider>("auto");
  const [context, setContext] = useState<AIContext>(defaultContext);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const idCounter = useRef(0);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const makeId = () => `msg-${Date.now()}-${++idCounter.current}`;

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: DisplayMessage = {
        id: makeId(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      setError("");

      try {
        // Build history from previous messages (last 10 for context window)
        const history: ChatMessage[] = messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await sendChatMessage(provider, context, text.trim(), history);

        // Handle both direct response and nested data structure
        const responseText = typeof res === "object" && res !== null
          ? (res as any).data?.response ?? (res as any).response ?? "No response received"
          : String(res);

        const providerName = typeof res === "object" && res !== null
          ? (res as any).data?.provider ?? (res as any).provider ?? provider
          : provider;

        const aiMsg: DisplayMessage = {
          id: makeId(),
          role: "assistant",
          content: responseText,
          provider: providerName,
          timestamp: new Date(),
          context,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (e: any) {
        setError(e.message || "Failed to get AI response");
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: "⚠️ Sorry, I couldn't process your request right now. Please try again.",
            provider: provider,
            timestamp: new Date(),
            context,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, provider, context, loading]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError("");
  }, []);

  const switchProvider = useCallback((p: AIProvider) => {
    setProvider(p);
  }, []);

  const switchContext = useCallback((c: AIContext) => {
    setContext(c);
  }, []);

  return {
    messages,
    loading,
    error,
    provider,
    context,
    scrollRef,
    sendMessage,
    clearHistory,
    switchProvider,
    switchContext,
  };
}
