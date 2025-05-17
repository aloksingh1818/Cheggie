import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2, Bot, Trash2, Copy, Check, Image as ImageIcon, X, Sparkles, Plus, MessageSquare, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface Message {
  role: string;
  content: string;
  type: "text" | "image";
  id: string;
  imageUrl?: string;
  isRaw?: boolean;
}

export function AdminDeepSeek() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('admin-deepseek-chat-history');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; timestamp: number }[]>(() => {
    const savedHistory = localStorage.getItem('admin-deepseek-chat-sessions');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    const savedId = localStorage.getItem('admin-deepseek-current-chat');
    return savedId || Date.now().toString();
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useChegggPrompt, setUseChegggPrompt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to access the admin chat");
      navigate("/login");
    }
  }, [navigate]);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem('admin-deepseek-chat-sessions', JSON.stringify(chatHistory));
    localStorage.setItem('admin-deepseek-current-chat', currentChatId);
  }, [chatHistory, currentChatId]);

  // Save messages for current chat
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`admin-deepseek-chat-${currentChatId}`, JSON.stringify(messages));
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      fileInputRef.current.value = '';
    }
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
      // Fallback for older browsers or permission issues
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          setCopiedId(id);
          toast.success("Copied to clipboard!");
          setTimeout(() => setCopiedId(null), 2000);
        } else {
          throw new Error('Fallback copy command failed');
        }
      } catch (fallbackErr) {
        console.error("Copy failed:", fallbackErr);
        toast.error("Failed to copy text. Please try selecting and copying manually.");
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(`admin-deepseek-chat-${currentChatId}`);
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setIsThinking(true);

    const newMessages: Message[] = [];
    if (input.trim()) {
      newMessages.push({
        role: "user",
        content: input,
        type: "text",
        id: Date.now().toString()
      });
    }
    if (selectedImage && imagePreview) {
      newMessages.push({
        role: "user",
        content: "Analyze this image:",
        type: "image",
        id: (Date.now() + 1).toString(),
        imageUrl: imagePreview
      });
    }

    setMessages(prevMessages => [...prevMessages, ...newMessages]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setUseChegggPrompt(false);

    try {
      const response = await fetch("/api/ai-models/deepseek-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
          ],
          useChegggPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format');
      }

      setMessages(prevMessages => [...prevMessages, {
        role: "assistant",
        content: data.choices[0].message.content,
        type: "text",
        id: (Date.now() + 2).toString()
      }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prevMessages => [...prevMessages, {
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, there was an error processing your message.",
        type: "text",
        id: (Date.now() + 1).toString()
      }]);
      toast.error(error instanceof Error ? error.message : "Failed to get response from DeepSeek");
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  }, [input, messages, isLoading, selectedImage, imagePreview, useChegggPrompt, navigate]);

  const renderMessage = (message: Message, index: number) => {
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
              {message.isRaw ? (
                <pre className="text-sm">{messageText}</pre>
              ) : (
                <KatexMarkdownRenderer markdown={messageText} />
              )}
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
              onClick={() => {
                setMessages(prevMessages => 
                  prevMessages.map(msg => 
                    msg.id === message.id 
                      ? { ...msg, isRaw: !msg.isRaw }
                      : msg
                  )
                );
              }}
              title={message.isRaw ? "Show rendered" : "Show raw"}
            >
              <Code className="h-3 w-3" />
            </Button>
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
    localStorage.setItem('admin-deepseek-chat-history', JSON.stringify([]));
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`admin-deepseek-chat-${chatId}`);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);
  };

  // Mock admin stats
  const stats = [
    { label: "Total Messages", value: 432 },
    { label: "Credits Used", value: 99 },
    { label: "Active Users", value: 7 },
    { label: "Errors", value: 2 },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      {/* Admin Monitoring Panel */}
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>DeepSeek Chatbot Monitoring</CardTitle>
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

      <div className="flex h-[calc(100vh-12rem)]">
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
          <ScrollArea className="h-[calc(100vh-16rem)]">
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
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600"
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      DeepSeek Chat
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI model specialized in complex reasoning and analysis
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <ScrollArea ref={scrollRef} className="flex-1 mb-4">
                <div className="space-y-4 p-4">
                  <AnimatePresence>
                    {messages.map((message) => renderMessage(message, 0))}
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">DeepSeek is thinking...</span>
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
                  className="shrink-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={useChegggPrompt ? "default" : "outline"}
                  onClick={() => setUseChegggPrompt(!useChegggPrompt)}
                  disabled={isLoading}
                  className={cn(
                    "shrink-0 gap-2",
                    useChegggPrompt && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Sparkles className={cn("h-4 w-4", useChegggPrompt && "animate-pulse")} />
                  <span className="text-sm font-medium">
                    {useChegggPrompt ? "Cheggg Mode Active" : "Enable Cheggg Mode"}
                  </span>
                </Button>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Chat with DeepSeek..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className="min-w-[80px] shrink-0"
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
    </div>
  );
}

function KatexMarkdownRenderer({ markdown }: { markdown: string }) {
  // Split the markdown into parts: text, inline math ($...$), and block math ($$...$$)
  // This is a simple parser; for more complex needs, use a markdown-it plugin
  const parts = [];
  let text = markdown;
  const blockMathRegex = /\$\$([\s\S]+?)\$\$/g;
  let lastIndex = 0;
  let match;
  while ((match = blockMathRegex.exec(markdown))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: markdown.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'block', value: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < markdown.length) {
    text = markdown.slice(lastIndex);
  } else {
    text = '';
  }
  // Now split the remaining text by inline math
  const inlineMathRegex = /\$([^$\n]+?)\$/g;
  let lastInline = 0;
  let inlineMatch;
  while ((inlineMatch = inlineMathRegex.exec(text))) {
    if (inlineMatch.index > lastInline) {
      parts.push({ type: 'text', value: text.slice(lastInline, inlineMatch.index) });
    }
    parts.push({ type: 'inline', value: inlineMatch[1] });
    lastInline = inlineMatch.index + inlineMatch[0].length;
  }
  if (lastInline < text.length) {
    parts.push({ type: 'text', value: text.slice(lastInline) });
  }
  // Render all parts, stripping unmatched $ or $$
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'block') return <BlockMath key={i}>{part.value}</BlockMath>;
        if (part.type === 'inline') return <InlineMath key={i}>{part.value}</InlineMath>;
        // Strip any unmatched $ or $$ from text parts
        const clean = part.value.replace(/\${1,2}/g, '');
        return <span key={i} dangerouslySetInnerHTML={{ __html: marked(clean) }} />;
      })}
    </>
  );
} 