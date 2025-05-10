import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, Trash2, Copy, Check, Image as ImageIcon, X, Sparkles, Plus, MessageSquare, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { marked } from "marked";

interface Message {
  id: string;
  role: string;
  content: string;
  type: "text" | "image" | "file" | "voice";
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

export function Gemini() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('gemini-chat-history');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; timestamp: number }[]>(() => {
    const savedHistory = localStorage.getItem('gemini-chat-sessions');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    const savedId = localStorage.getItem('gemini-current-chat');
    return savedId || Date.now().toString();
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [useChegggPrompt, setUseChegggPrompt] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem('gemini-chat-sessions', JSON.stringify(chatHistory));
    localStorage.setItem('gemini-current-chat', currentChatId);
  }, [chatHistory, currentChatId]);

  // Save messages for current chat
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`gemini-chat-${currentChatId}`, JSON.stringify(messages));
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

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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
    localStorage.setItem('gemini-chat-history', JSON.stringify([]));
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`gemini-chat-${chatId}`);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);
  };

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleChegggPromptClick = () => {
    setUseChegggPrompt(true);
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && !selectedImage && attachments.length === 0) || isLoading) return;

    setIsLoading(true);
    setIsThinking(true);
    const newMessages: Message[] = [];

    let systemPrompt = "";
    if (useChegggPrompt) {
      systemPrompt = `
You are a math tutor. Always answer in exactly 3 steps, with a clear explanation for each step, and provide a final summary.
- Use Markdown formatting for headings, bold, and lists.
- For all equations, use Markdown code blocks or LaTeX formatting (e.g., \`ax^2 + bx + c = 0\` or \`x = [-b \\pm \\sqrt{b^2 - 4ac}]/(2a)\`).
- Show all calculations step by step, including plugging in values and simplifying.
- Do not stop until you have finished all 3 steps and the final summary.
- Always include a section titled 'Final Summary' at the end.

Example format:

---

### **Step 1: Write the Quadratic Equation**

A quadratic equation is in the form:  
\`ax^2 + bx + c = 0\`

Let's take a **third quadratic equation** (as you requested), so, for example:  
\`3x^2 - 5x + 2 = 0\`

---

### **Step 2: Use the Quadratic Formula**

The roots of a quadratic equation can be found using the quadratic formula:  
\`x = [-b \\pm \\sqrt{b^2 - 4ac}]/(2a)\`

For our equation:  
- a = 3  
- b = -5  
- c = 2  

Let's substitute these values in:

- Calculate the discriminant:  
  \`b^2 - 4ac = (-5)^2 - 4*3*2 = 25 - 24 = 1\`

- Plug into the formula:  
  \`x = [5 \\pm \\sqrt{1}]/6\`

---

### **Step 3: Solve for the Roots**

Now, compute the two roots:

- \`\\sqrt{1} = 1\`

So,  
\`x_1 = (5 + 1)/6 = 6/6 = 1\`  
\`x_2 = (5 - 1)/6 = 4/6 = 2/3\`

---

### **Final Summary**

**To find the roots of a quadratic equation**,  
1. **Write it in standard form (\`ax^2 + bx + c = 0\`).**  
2. **Apply the quadratic formula and calculate the discriminant.**  
3. **Solve for the two roots.**

**For the equation \`3x^2 - 5x + 2 = 0\`, the roots are x = 1 and x = 2/3.**
---
`;
    }

    // Add text message if exists
    if (input.trim()) {
      newMessages.push({ id: Date.now().toString(), role: "user", content: input, type: "text" });
    }

    // Add image message if exists
    if (selectedImage) {
      newMessages.push({
        role: "user",
        content: selectedImage.name,
        type: "image",
        id: Date.now().toString(),
        imageUrl: imagePreview || undefined
      });
    }

    // Add file messages if attachments exist
    for (const file of attachments) {
      newMessages.push({
        role: "user",
        content: file.name,
        type: file.type.startsWith("image/") ? "image" : "file",
        id: Date.now().toString(),
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
      });
    }

    setMessages(prevMessages => [...prevMessages, ...newMessages]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setAttachments([]);
    setUseChegggPrompt(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "https://cheggie-ai-nexus.com",
          "X-Title": "Cheggie AI Nexus",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro-preview",
          messages: [
            ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.type === "image"
                ? [
                    {
                      type: "text",
                      text: msg.content || "Please provide a detailed analysis of this image, describing all visible elements, their relationships, and any notable details."
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
            ...newMessages.map(msg => ({
              role: msg.role,
              content: msg.type === "image"
                ? [
                    {
                      type: "text",
                      text: msg.content || "Please provide a detailed analysis of this image, describing all visible elements, their relationships, and any notable details."
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: msg.fileUrl
                      }
                    }
                  ]
                : msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: true
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
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

                // Handle error chunk
                if (parsed.error) {
                  setMessages(prevMessages => [
                    ...prevMessages,
                    {
                      role: "assistant",
                      content: parsed.error.message || "An error occurred.",
                      type: "text",
                      id: Date.now().toString()
                    }
                  ]);
                  toast.error(parsed.error.message || "An error occurred.");
                  return; // Stop further processing
                }

                const content = parsed.choices?.[0]?.delta?.content || '';
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
          content:
            error instanceof TypeError && error.message === "Failed to fetch"
              ? "Network error: Unable to reach OpenRouter API. Please check your internet connection or try again later."
              : error instanceof Error
              ? error.message
              : "Sorry, there was an error processing your message.",
          type: "text",
          id: (Date.now() + 1).toString()
        }]);
        toast.error("Failed to get response from Gemini");
      }
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  }, [input, messages, isLoading, selectedImage, imagePreview, attachments, useChegggPrompt]);

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
            {message.type === "file" && (
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="h-4 w-4" />
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  {message.fileName}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Answer:</span>
              <label className="flex items-center cursor-pointer">
                <span className="mr-1">Rendered</span>
                <input
                  type="checkbox"
                  checked={showRaw}
                  onChange={() => setShowRaw((v) => !v)}
                  className="mx-1"
                />
                <span>Raw Text</span>
              </label>
            </div>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {message.role === "assistant" && showRaw
                ? <pre>{message.content}</pre>
                : <span dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }} />}
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
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600"
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Gemini Chat
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI assistant specialized in creative and analytical tasks
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
            <CardContent className="h-[calc(100%-5rem)]">
              <ScrollArea ref={scrollRef} className="h-[calc(100%-8rem)] mb-4">
                <div className="space-y-4 p-4">
                  <AnimatePresence>
                    {messages.map((message) => renderMessage(message))}
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">Gemini is thinking...</span>
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

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {attachments.map((file, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 bg-muted px-2 py-1 rounded"
                    >
                      {file.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Chat with Gemini..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleChegggPromptClick}
                  disabled={isLoading}
                  className="bg-yellow-400 text-black"
                >
                  Cheggg Prompt
                </Button>
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading || (!input.trim() && !selectedImage && attachments.length === 0)}
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
