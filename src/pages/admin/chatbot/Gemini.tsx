import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, Copy, Check, Image as ImageIcon, X, Sparkles, Plus, MessageSquare, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Message {
  role: string;
  content: string;
  type: "text" | "image";
  id: string;
  imageUrl?: string;
}

export function AdminGemini() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('admin-gemini-chat-history');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; timestamp: number }[]>(() => {
    const savedHistory = localStorage.getItem('admin-gemini-chat-sessions');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    const savedId = localStorage.getItem('admin-gemini-current-chat');
    return savedId || Date.now().toString();
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem('admin-gemini-chat-sessions', JSON.stringify(chatHistory));
    localStorage.setItem('admin-gemini-current-chat', currentChatId);
  }, [chatHistory, currentChatId]);

  // Save messages for current chat
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`admin-gemini-chat-${currentChatId}`, JSON.stringify(messages));
    }
  }, [messages, currentChatId]);

  // Update chat title when first message is sent
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user') {
      const title = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, title } : chat
      ));
    }
  }, [messages, currentChatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      timestamp: Date.now()
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setSelectedImage(null);
    setImagePreview(null);
    localStorage.setItem('admin-gemini-chat-history', JSON.stringify([]));
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`admin-gemini-chat-${chatId}`);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);
  };

  const copyToClipboard = async (text: string, id: string) => {
    if (!text) {
      toast.error("No text to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy text. Please try selecting and copying manually.");
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    setIsLoading(true);
    const newMessage: Message = {
      role: "user",
      content: input,
      type: selectedImage ? "image" : "text",
      id: Date.now().toString(),
      imageUrl: imagePreview || undefined
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    try {
      const response = await fetch("/api/ai-models/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-pro",
          messages: [
            { role: "system", content: "You are Gemini, an AI assistant created by Google. You are helpful, creative, and knowledgeable. When analyzing images or answering questions, provide detailed, comprehensive responses. Include relevant examples, explanations, and context. For image analysis, describe all visible elements, their relationships, and any notable details. For text queries, provide thorough explanations with supporting information. Aim for detailed, well-structured responses that fully address the user's query." },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: input }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      const data = await response.json();
      if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error(data.error || 'Invalid response format');
      }
      setMessages(prevMessages => [...prevMessages, {
        role: "assistant",
        content: data.candidates[0].content.parts[0].text,
        type: "text",
        id: Date.now().toString()
      }]);
    } catch (error) {
      setMessages(prevMessages => [...prevMessages, {
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, there was an error processing your message.",
        type: "text",
        id: Date.now().toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, selectedImage, imagePreview, isLoading]);

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    const isImage = message.type === "image";

    return (
      <div
        key={message.id}
        className={cn(
          "flex w-full items-start gap-4 p-4",
          isUser ? "bg-muted/50" : "bg-background"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          {isUser ? (
            <span className="text-sm font-medium">You</span>
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          {isImage && message.imageUrl && (
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
              <img
                src={message.imageUrl}
                alt="Uploaded"
                className="object-cover"
              />
            </div>
          )}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.content}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content, message.id)}
            >
              {copiedId === message.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Mock admin stats
  const stats = [
    { label: "Total Messages", value: 987 },
    { label: "Credits Used", value: 321 },
    { label: "Active Users", value: 18 },
    { label: "Errors", value: 1 },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      {/* Admin Monitoring Panel */}
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>Gemini Chatbot Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Chat UI */}
      <div className="flex-1 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Admin Gemini Chat</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)]">
            <ScrollArea className="h-[calc(100%-4rem)] mb-4">
              <div className="space-y-4">
                {messages.map(renderMessage)}
                {isLoading && (
                  <div className="flex items-center gap-2 p-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 