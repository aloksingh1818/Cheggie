import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { Send, Image, Mic, Paperclip, X, Loader2, Info } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { models } from "@/config/models";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  role: string;
  content: string;
  type: "text" | "image" | "file" | "voice";
  fileUrl?: string;
  fileName?: string;
}

export function ChatbotSelection() {
  const { model } = useParams();
  const location = useLocation();
  const [currentModel, setCurrentModel] = useState<typeof models[keyof typeof models] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [useChegggPrompt, setUseChegggPrompt] = useState(false);

  useEffect(() => {
    // Extract model name from URL path
    const pathParts = location.pathname.split('/');
    const modelName = pathParts[pathParts.length - 1].toLowerCase();
    setCurrentModel(models[modelName] || null);
  }, [location.pathname]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioFile = new File([audioBlob], "voice-message.wav", { type: "audio/wav" });
        setAttachments([...attachments, audioFile]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleChegggPromptClick = () => {
    setUseChegggPrompt(true);
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessages(prevMessages => [...prevMessages, { 
        role: "assistant", 
        content: "Please log in to continue chatting.", 
        type: "text" 
      }]);
      return;
    }

    setIsLoading(true);
    const newMessages: Message[] = [];

    let systemPrompt = "";
    if (useChegggPrompt) {
      systemPrompt = "Always answer in exactly 3 steps, with a clear explanation for each step, and provide a final summary. Use markdown formatting for headings, bold, and lists. Example format: ...";
    }

    // Add text message if exists
    if (input.trim()) {
      newMessages.push({ role: "user", content: input, type: "text" });
    }

    // Add attachments
    for (const file of attachments) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        const { url } = await uploadResponse.json();
        newMessages.push({
          role: "user",
          content: url,
          type: file.type.startsWith("image/") ? "image" : "file",
          fileUrl: url,
          fileName: file.name,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        setMessages(prevMessages => [...prevMessages, { 
          role: "assistant", 
          content: "Failed to upload file. Please try again.", 
          type: "text" 
        }]);
        setIsLoading(false);
        return;
      }
    }

    setMessages([...messages, ...newMessages]);
    setInput("");
    setAttachments([]);
    setUseChegggPrompt(false);

    try {
      if (model === 'deepseek') {
        try {
          // Use OpenRouter API for DeepSeek
          const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": "Bearer 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",
              "HTTP-Referer": window.location.origin,
              "X-Title": "Cheggie AI Nexus",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "deepseek/deepseek-r1:free",
              "messages": [
                ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
                ...messages.map(msg => ({
                  role: msg.role,
                  content: msg.content
                })),
                ...newMessages.map(msg => ({
                  role: msg.role,
                  content: msg.content
                }))
              ],
              "temperature": 0.7,
              "max_tokens": 1000
            })
          });

          // Check if the response is JSON
          const contentType = openRouterResponse.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await openRouterResponse.text();
            console.error("Non-JSON response:", text);
            throw new Error("Invalid response format from OpenRouter API");
          }

          if (!openRouterResponse.ok) {
            const errorData = await openRouterResponse.json();
            throw new Error(errorData.error?.message || `OpenRouter API error: ${openRouterResponse.status}`);
          }

          const openRouterData = await openRouterResponse.json();
          
          if (!openRouterData.choices?.[0]?.message?.content) {
            console.error("Invalid response structure:", openRouterData);
            throw new Error('Invalid response format from DeepSeek');
          }

          const assistantMessage = openRouterData.choices[0].message;
          setMessages(prevMessages => [...prevMessages, { 
            role: "assistant", 
            content: assistantMessage.content, 
            type: "text" 
          }]);
        } catch (error) {
          console.error("OpenRouter API error:", error);
          setMessages(prevMessages => [...prevMessages, { 
            role: "assistant", 
            content: error instanceof Error ? error.message : "Failed to get response from DeepSeek. Please try again.", 
            type: "text" 
          }]);
          setIsLoading(false);
          return;
        }
      } else {
        // Use default backend API for other models
        const response = await fetch(`http://localhost:5000/api/chat/${model}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messages: [
              ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
              ...messages,
              ...newMessages
            ],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to get response from the server');
        }

        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { 
          role: "assistant", 
          content: data.message, 
          type: "text" 
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [...prevMessages, { 
        role: "assistant", 
        content: error instanceof Error ? error.message : "Sorry, there was an error processing your message. Please try again.", 
        type: "text" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    return (
      <div
        key={index}
        className={cn(
          "flex",
          message.role === "user" ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] rounded-lg p-3",
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          {message.type === "image" && (
            <img
              src={message.fileUrl}
              alt="Uploaded"
              className="max-w-full rounded-lg mb-2"
            />
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
          {message.content}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    currentModel?.color || "bg-gray-500"
                  )}>
                    {currentModel?.imageUrl && (
                      <img
                        src={currentModel.imageUrl}
                        alt={currentModel.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/24?text=AI";
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {currentModel?.name || "Select a Model"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {currentModel?.description || "Choose an AI model to start chatting"}
                    </p>
                  </div>
                </div>
                {currentModel && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Powered by {currentModel.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)]">
              <ScrollArea className="h-[calc(100%-8rem)] mb-4">
                <div className="space-y-4">
                  {messages.map((message, index) => renderMessage(message, index))}
                </div>
              </ScrollArea>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {attachments.map((file, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      {file.type.startsWith("image/") ? (
                        <Image className="h-3 w-3" />
                      ) : (
                        <Paperclip className="h-3 w-3" />
                      )}
                      {file.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={currentModel ? `Chat with ${currentModel.name}...` : "Select a model to start chatting..."}
                  className="flex-1"
                  disabled={!currentModel}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  disabled={!currentModel}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" disabled={!currentModel}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <Image className="mr-2 h-4 w-4" />
                      Upload Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="mr-2 h-4 w-4" />
                      Upload File
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!currentModel}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleChegggPromptClick}
                  disabled={isLoading || !currentModel}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
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