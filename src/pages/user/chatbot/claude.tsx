import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, Trash2, Copy, Check, Image as ImageIcon, X, Sparkles, Plus, MessageSquare, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { marked } from "marked";

interface Message {
  role: string;
  content: string;
  type: "text" | "image";
  id: string;
  imageUrl?: string;
  isRaw?: boolean;
}

export function Claude() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on component mount
    const savedMessages = localStorage.getItem('claude-chat-history');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; timestamp: number }[]>(() => {
    const savedHistory = localStorage.getItem('claude-chat-sessions');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    const savedId = localStorage.getItem('claude-current-chat');
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

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('claude-chat-history', JSON.stringify(messages));
  }, [messages]);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem('claude-chat-sessions', JSON.stringify(chatHistory));
    localStorage.setItem('claude-current-chat', currentChatId);
  }, [chatHistory, currentChatId]);

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

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const copyToClipboard = async (text: string, id: string) => {
    if (!text) {
      toast.error("No text to copy");
      return;
    }

    try {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      
      // Select and copy the text
      textarea.select();
      const successful = document.execCommand('copy');
      
      // Clean up
      document.body.removeChild(textarea);

      if (successful) {
        setCopiedId(id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.error("Copy failed:", err);
      // Fallback to clipboard API if available
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
      } catch (clipboardErr) {
        console.error("Clipboard API failed:", clipboardErr);
        toast.error("Failed to copy text. Please try selecting and copying manually.");
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedImage(null);
    setImagePreview(null);
    localStorage.removeItem('claude-chat-history');
    toast.success("Chat cleared!");
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
    setIsThinking(true);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Cheggie AI Nexus",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "anthropic/claude-3.7-sonnet",
          "messages": [
            {
              "role": "system",
              "content": useChegggPrompt ? 
                `You are a specialized AI tutor that provides step-by-step solutions to problems. Follow these rules strictly:

1. Always structure your response in exactly 3 steps plus a final summary:
   - Step 1: Initial Analysis
   - Step 2: Detailed Solution
   - Step 3: Verification
   - Final Summary

2. Use markdown formatting:
   - Use **bold** for key terms
   - Use \`code\` for formulas
   - Use LaTeX for equations: $E = mc^2$
   - Use bullet points for lists
   - Use numbered lists for steps

3. Keep each step concise but complete
4. Always end with a clear final summary
5. If the question is not a problem to solve, adapt the format to provide a clear, structured response` :
                "You are Claude, an AI assistant created by Anthropic. You are helpful, creative, and knowledgeable. When analyzing images or answering questions, provide detailed, comprehensive responses. Include relevant examples, explanations, and context. For image analysis, describe all visible elements, their relationships, and any notable details. For text queries, provide thorough explanations with supporting information. Aim for detailed, well-structured responses that fully address the user's query."
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.type === "image" 
                ? [
                    {
                      type: "text",
                      text: msg.content || "What is in this image?"
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: msg.imageUrl
                      }
                    }
                  ]
                : msg.content
            })),
            {
              role: "user",
              content: selectedImage && imagePreview
                ? [
                    {
                      type: "text",
                      text: input || "What is in this image?"
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: imagePreview
                      }
                    }
                  ]
                : input
            }
          ],
          "temperature": 0.7,
          "max_tokens": 4000,
          "stream": true
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      let accumulatedResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                let content = '';

                // Standard OpenAI/Anthropic streaming format
                if (
                  parsed &&
                  typeof parsed === 'object' &&
                  Array.isArray(parsed.choices) &&
                  parsed.choices.length > 0 &&
                  parsed.choices[0] &&
                  parsed.choices[0].delta &&
                  typeof parsed.choices[0].delta.content === 'string'
                ) {
                  content = parsed.choices[0].delta.content;
                } else if (typeof parsed.content === 'string') {
                  // Fallback: some APIs may just send { content: "..." }
                  content = parsed.content;
                }

                // Debug: log every chunk
                console.log('Claude chunk:', parsed);

                if (content) {
                  accumulatedResponse += content;
                  setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content = accumulatedResponse;
                    } else {
                      newMessages.push({
                        role: 'assistant',
                        content: accumulatedResponse,
                        type: 'text',
                        id: Date.now().toString()
                      });
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error('Error parsing chunk:', e, data);
                continue;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.name === 'AbortError') {
        toast.error("Request timed out. Please try again.");
      } else {
        setMessages(prevMessages => [...prevMessages, {
          role: "assistant",
          content: error instanceof Error ? error.message : "Sorry, there was an error processing your message.",
          type: "text",
          id: (Date.now() + 1).toString()
        }]);
        toast.error("Failed to get response from Claude");
      }
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setUseChegggPrompt(false);
    }
  }, [input, messages, isLoading, selectedImage, imagePreview, useChegggPrompt]);

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
                <div dangerouslySetInnerHTML={{ __html: marked(messageText) }} />
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
    localStorage.setItem('claude-chat-history', JSON.stringify([]));
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`claude-chat-${chatId}`);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);
  };

  // Update chat title when first message is sent
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user') {
      const title = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, title } : chat
      ));
    }
  }, [messages, currentChatId]);

  // Save messages for current chat
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`claude-chat-${currentChatId}`, JSON.stringify(messages));
    }
  }, [messages, currentChatId]);

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
        <div className="flex-1 flex flex-col">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600"
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Claude Chat
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI assistant specialized in natural conversation and analysis
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
            <CardContent className="flex-1 flex flex-col">
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
                        <span className="text-sm">Claude is thinking...</span>
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

              <div className="flex gap-2 items-center">
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
                  placeholder="Chat with Claude..."
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
    </Layout>
  );
}
