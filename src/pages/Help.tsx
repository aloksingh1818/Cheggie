import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, BookOpen, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export function Help() {
  const faqs = [
    {
      question: "How do I get started with Cheggie AI Nexus?",
      answer: "To get started, simply create an account and purchase credits. You can then use our AI models to get answers to your questions or start a chat conversation."
    },
    {
      question: "What AI models are available?",
      answer: "We currently support GPT-4, GPT-3.5 Turbo, Claude 3, and Gemini Pro. Each model has its own strengths and credit costs."
    },
    {
      question: "How does the credit system work?",
      answer: "Credits are used to pay for AI model usage. Different models and features have different credit costs. You can purchase credits through our platform."
    },
    {
      question: "Can I get a refund for unused credits?",
      answer: "Yes, you can request a refund for unused credits. Please contact our support team for assistance."
    },
    {
      question: "How accurate are the AI responses?",
      answer: "Our AI models are highly accurate, but we recommend verifying critical information. You can flag any incorrect responses for review."
    }
  ];

  const supportChannels = [
    {
      title: "Email Support",
      description: "Get help via email",
      icon: Mail,
      action: "Contact Support",
      href: "mailto:support@cheggie-ai.com"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      action: "Start Chat",
      href: "/chat"
    },
    {
      title: "Documentation",
      description: "Read our detailed guides",
      icon: BookOpen,
      action: "View Docs",
      href: "/docs"
    }
  ];

  const extensions = [
    {
      id: 1,
      name: "Extension 1",
      description: "Description of Extension 1",
      creditPrice: 10,
      active: true
    },
    {
      id: 2,
      name: "Extension 2",
      description: "Description of Extension 2",
      creditPrice: 15,
      active: false
    },
    {
      id: 3,
      name: "Extension 3",
      description: "Description of Extension 3",
      creditPrice: 20,
      active: true
    }
  ];

  const toggleStatus = (id: number) => {
    // Implementation of toggleStatus function
  };

  const editExtension = (ext: any) => {
    // Implementation of editExtension function
  };

  const deleteExtension = (id: number) => {
    // Implementation of deleteExtension function
  };

  const openAddModal = () => {
    // Implementation of openAddModal function
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Chegg Master (Admin)</h1>
      <p className="text-muted-foreground">Full control over all Chegg extensions and users</p>

      {/* Extension Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {extensions.map(ext => (
          <Card key={ext.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {ext.name}
                <Badge variant={ext.active ? "success" : "destructive"}>
                  {ext.active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-muted-foreground">{ext.description}</p>
              <div className="mb-2 text-sm font-medium">
                Credit Price: <span className="text-primary font-bold">{ext.creditPrice} credits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Status:</span>
                <Switch checked={ext.active} onCheckedChange={() => toggleStatus(ext.id)} />
              </div>
              {/* Admin Controls */}
              <div className="flex gap-2 mt-2">
                <Button onClick={() => editExtension(ext)}>Edit</Button>
                <Button onClick={() => deleteExtension(ext.id)} variant="destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* Add Extension Card */}
        <Card className="flex items-center justify-center cursor-pointer" onClick={openAddModal}>
          <CardContent>
            <Plus className="h-8 w-8 text-primary" />
            <div>Add Extension</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <h2 className="text-2xl font-bold mt-8">Extension Analytics</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Analytics cards for each extension */}
      </div>

      {/* User Table */}
      <h2 className="text-2xl font-bold mt-8">User Management</h2>
      <Card>
        <CardContent>
          {/* Table of users and their extension usage */}
        </CardContent>
      </Card>
    </div>
  );
}
