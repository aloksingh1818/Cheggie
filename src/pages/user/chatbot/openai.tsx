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

export function OpenAI() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('openai-chat-history');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; timestamp: number }[]>(() => {
    const savedHistory = localStorage.getItem('openai-chat-sessions');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    const savedId = localStorage.getItem('openai-current-chat');
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
    localStorage.setItem('openai-chat-sessions', JSON.stringify(chatHistory));
    localStorage.setItem('openai-current-chat', currentChatId);
  }, [chatHistory, currentChatId]);

  // Save messages for current chat
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`openai-chat-${currentChatId}`, JSON.stringify(messages));
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
    localStorage.setItem('openai-chat-history', JSON.stringify([]));
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`openai-chat-${chatId}`);
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
      const response = await fetch("/api/ai-models/openai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are ChatGPT, an AI assistant created by OpenAI. You are helpful, creative, and knowledgeable. When analyzing images or answering questions, provide detailed, comprehensive responses. Include relevant examples, explanations, and context. For image analysis, describe all visible elements, their relationships, and any notable details. For text queries, provide thorough explanations with supporting information. Aim for detailed, well-structured responses that fully address the user's query." },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: input }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      const data = await response.json();
      if (!response.ok || !data.choices?.[0]?.message?.content) {
        throw new Error(data.error || 'Invalid response format');
      }
      setMessages(prevMessages => [...prevMessages, {
        role: "assistant",
        content: data.choices[0].message.content,
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

  const handleModelSwitch = (model: string) => {
    navigate(`/chatbot/${model.toLowerCase()}`);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    const messageText = message.content || "";
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex group",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div className="relative max-w-[85%]">
          <div
            className={cn(
              "rounded-lg p-4 shadow-sm",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {message.type === "image" && message.imageUrl && (
              <div className="mb-2">
                <img
                  src={message.imageUrl}
                  alt="Uploaded"
                  className="max-w-full rounded-lg max-h-[300px] object-contain"
                />
              </div>
            )}
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {messageText}
            </div>
          </div>
          <div className={cn(
            "absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-background/80"
              onClick={() => copyToClipboard(messageText, message.id)}
              title="Copy message"
            >
              {copiedId === message.id ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/40 p-4">
          <Button
            onClick={createNewChat}
            className="w-full mb-4"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant={currentChatId === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => switchChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="truncate">{chat.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600"
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer group">
                          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                            ChatGPT
                          </CardTitle>
                          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="start" 
                        className="w-[200px] animate-in fade-in-0 zoom-in-95"
                        sideOffset={5}
                      >
                        <DropdownMenuItem 
                          onClick={() => handleModelSwitch('openai')}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span>ChatGPT</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleModelSwitch('gemini')}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span>Gemini</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleModelSwitch('claude')}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span>Claude</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleModelSwitch('deepseek')}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span>DeepSeek</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI assistant powered by OpenAI's GPT-4
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)]">
              <ScrollArea ref={scrollRef} className="h-[calc(100%-8rem)] mb-4">
                <div className="space-y-4 p-4">
                  <AnimatePresence>
                    {messages.map((message) => renderMessage(message))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">ChatGPT is thinking...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              {imagePreview && (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[200px] rounded-lg object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 bg-background/80 hover:bg-background"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Chat with ChatGPT..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className="min-w-[80px]"
                >
                  {isLoading ? (
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 
