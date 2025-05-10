
import React, { useState } from "react";
import { Send, Bot, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  model?: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content:
        "Hello! I'm Cheggie's AI assistant powered by multiple AI models. How can I help you today?",
      sender: "bot",
      model: "GPT-4o",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const handleSend = () => {
    if (inputText.trim()) {
      // Add user message
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          content: inputText,
          sender: "user",
          timestamp: new Date(),
        },
      ]);
      
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: `This is a simulated response from ${selectedModel}. In a real implementation, this would be an actual response from the AI model.`,
            sender: "bot",
            model: selectedModel,
            timestamp: new Date(),
          },
        ]);
      }, 1000);
      
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
              <SelectItem value="claude">Claude 3 (Anthropic)</SelectItem>
              <SelectItem value="gemini">Gemini Pro (Google)</SelectItem>
              <SelectItem value="deepseek">DeepSeek (DeepSeek)</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">Credits used: 250</span>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-3xl",
              message.sender === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            {message.sender === "user" ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8 bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={cn(
                "rounded-lg p-3",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div>{message.content}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {message.model && (
                  <span className="text-xs opacity-70">{message.model}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <textarea
              className="w-full min-h-[80px] resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Type your message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <div className="mt-1 flex justify-between">
              <span className="text-xs text-muted-foreground">
                Powered by multiple AI models
              </span>
              <span className="text-xs text-muted-foreground">
                AI credits: 1,250
              </span>
            </div>
          </div>
          <Button onClick={handleSend} type="submit">
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
