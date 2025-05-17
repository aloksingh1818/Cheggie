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

export function AdminChatbotSelection() {
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

  // ... (UI for model selection, chat input, attachments, and message rendering)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Chatbot Selection</h1>
        <p className="text-muted-foreground">
          Select and interact with any AI chatbot as an admin. Enjoy advanced features and controls.
        </p>
      </div>
      {/* Model selection UI, chat area, and advanced controls go here (similar to user version) */}
      {/* ... (for brevity, not repeating the full UI code here, but it matches the user version) ... */}
    </div>
  );
} 