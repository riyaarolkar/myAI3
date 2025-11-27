"use client";

import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { Send, Sparkles, ShoppingBag, MessageCircle, Lightbulb, User, RotateCcw } from "lucide-react";
import { ExploreGrid } from "@/components/handbags/explore-grid";
import { HandbagResult } from "@/components/handbags/product-card";
import Link from "next/link";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  tip?: string | null;
  products?: HandbagResult[];
  isLoading?: boolean;
  timestamp: Date;
}

interface ConciergeResponse {
  message: string;
  tip: string | null;
  filters: {
    brand?: string | null;
    color?: string | null;
    maxPrice?: number | null;
    minPrice?: number | null;
    bagType?: string | null;
    occasion?: string | null;
  };
  searchQuery: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Welcome to Luxury Handbag Explorer! I'm your personal concierge, here to help you find the perfect designer bag. Tell me what you're looking for — whether it's a specific brand, occasion, style, or budget — and I'll curate the best options for you.",
  tip: "Try asking something like 'Find me a black Chanel bag under $5000' or 'I need an evening clutch for a wedding'",
  timestamp: new Date(),
};

export default function LandingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const performSearch = async (searchQuery: string, filters: ConciergeResponse["filters"]): Promise<HandbagResult[]> => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filters.brand) params.set("brands", filters.brand);
      if (filters.bagType) params.set("bag_type", filters.bagType);
      
      if (filters.maxPrice) {
        params.set("max_price", filters.maxPrice.toString());
      }
      if (filters.minPrice) {
        params.set("min_price", filters.minPrice.toString());
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to search");
      }
      const data = await response.json();
      return data.results || [];
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isProcessing) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      isLoading: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      const conciergeRes = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      let conciergeData: ConciergeResponse;
      
      if (conciergeRes.ok) {
        conciergeData = await conciergeRes.json();
      } else {
        conciergeData = {
          message: "I'd be happy to help you find the perfect bag! Let me search for that.",
          tip: null,
          filters: {},
          searchQuery: trimmedInput,
        };
      }

      let searchQuery = conciergeData.searchQuery || trimmedInput;
      if (conciergeData.filters.color) {
        searchQuery = `${conciergeData.filters.color} ${searchQuery}`;
      }

      const products = await performSearch(searchQuery, conciergeData.filters);

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: conciergeData.message,
        tip: conciergeData.tip,
        products: products,
        timestamp: new Date(),
      };

      setMessages(prev => 
        prev.map(msg => msg.id === assistantMessageId ? assistantMessage : msg)
      );

      if (products.length === 0) {
        toast.info("No exact matches found. Try broadening your search!");
      }
    } catch (err) {
      console.error("Error:", err);
      
      const errorMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "I apologize, but I encountered an issue while searching. Please try again with a different query.",
        timestamp: new Date(),
      };

      setMessages(prev => 
        prev.map(msg => msg.id === assistantMessageId ? errorMessage : msg)
      );
      
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleNewConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setInputValue("");
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 flex flex-col">
      <Toaster 
        position="top-center" 
        richColors 
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e7e5e4',
            color: '#1c1917',
          },
        }}
      />
      
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-900 to-stone-700 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-semibold text-stone-900 tracking-tight">Luxury Handbag Explorer</h1>
                <p className="text-xs text-stone-500">Your AI Personal Concierge</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
              
              <Link 
                href="/explore" 
                className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
              >
                Explore
              </Link>

              <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-medium">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex-1 space-y-6 pb-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="bg-stone-900 text-white px-5 py-3 rounded-2xl rounded-tr-md shadow-sm">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-stone-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-full w-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-800">Personal Concierge</span>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      </div>
                      
                      {message.isLoading ? (
                        <div className="bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-100 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm max-w-xl">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm text-stone-500">Finding perfect bags for you...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-100 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm max-w-xl">
                            <p className="text-stone-700 leading-relaxed">{message.content}</p>
                            
                            {message.tip && (
                              <div className="mt-3 flex items-start gap-2 bg-white/70 rounded-xl px-4 py-3 border border-amber-100/50">
                                <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-stone-600 italic">{message.tip}</p>
                              </div>
                            )}
                          </div>
                          
                          {message.products && message.products.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs text-stone-500 mb-3 font-medium">
                                Found {message.products.length} matching bags:
                              </p>
                              <ExploreGrid
                                results={message.products}
                                isLoading={false}
                                hasSearched={true}
                                error={null}
                                showCompare={true}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs text-stone-500 mb-3 text-center">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Find a black Chanel bag under $5000",
                "Show me Hermès Birkin bags",
                "I need an evening clutch for a wedding",
                "What tote bags do you recommend?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs px-4 py-2 bg-white border border-stone-200 rounded-full text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="sticky bottom-0 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent pt-4 pb-2">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex gap-3 bg-white border border-stone-200 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything… e.g. 'Find a bag for a cocktail dinner under $5000'"
                  disabled={isProcessing}
                  className="w-full h-12 px-4 bg-transparent text-stone-900 placeholder-stone-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !inputValue.trim()}
                className="h-12 w-12 bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-stone-400 text-center mt-2">
              Your AI concierge searches across premium retailers worldwide
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
