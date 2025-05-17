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
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Message {
  role: string;
  content: string;
  type: "text" | "image" | "file" | "voice";
  fileUrl?: string;
  fileName?: string;
  id: string;
  imageUrl?: string;
}

export function ChatbotSelection() {
  const { model } = useParams();
  const location = useLocation();
  const [currentModel, setCurrentModel] = useState<typeof models[keyof typeof models] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [useChegggPrompt, setUseChegggPrompt] = useState(false);
  const navigate = useNavigate();

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
    if ((!input.trim() && !attachments.length) || isLoading) return;

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
    if (attachments.length > 0) {
      newMessages.push({
        role: "user",
        content: "Analyze these images:",
        type: "image",
        id: (Date.now() + 1).toString(),
        imageUrl: URL.createObjectURL(attachments[0])
      });
    }

    setMessages(prevMessages => [...prevMessages, ...newMessages]);
    setInput("");
    setAttachments([]);
    setUseChegggPrompt(false);

    try {
      const systemPrompt = useChegggPrompt ? "Always answer in exactly 3 steps, with a clear explanation for each step, and provide a final summary. Use markdown formatting for headings, bold, and lists." : "";
      const response = await fetch(`/api/ai-models/${model}-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [
            ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
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
      toast.error(error instanceof Error ? error.message : "Failed to get response from the AI model");
    } finally {
      setIsLoading(false);
      setIsThinking(false);
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