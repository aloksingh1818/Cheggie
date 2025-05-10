
import { Layout } from "@/components/layout/Layout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Card } from "@/components/ui/card";

export function Chat() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Chat</h1>
          <p className="text-muted-foreground">
            Interact with multiple AI models and compare responses.
          </p>
        </div>
        
        <Card className="flex-1">
          <ChatInterface />
        </Card>
      </div>
    </Layout>
  );
}
