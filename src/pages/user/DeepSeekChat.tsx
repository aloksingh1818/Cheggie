import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: string;
  content: string;
  type: "text";
}

export function DeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessage: Message = {
      role: "user",
      content: input,
      type: "text"
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput("");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            {
              "role": "system",
              "content": "You are a helpful AI assistant that provides accurate, concise, and informative responses."
            },
            ...messages,
            newMessage
          ],
          "temperature": 0.7,
          "max_tokens": 1000
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
        type: "text"
      }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prevMessages => [...prevMessages, {
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, there was an error processing your message.",
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
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500">
                    <img
                      src="https://deepseek.com/favicon.ico"
                      alt="DeepSeek"
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/24?text=AI";
                      }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      DeepSeek Chat
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI model specialized in complex reasoning and analysis
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)]">
              <ScrollArea className="h-[calc(100%-8rem)] mb-4">
                <div className="space-y-4">
                  {messages.map((message, index) => renderMessage(message, index))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Chat with DeepSeek..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading}
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