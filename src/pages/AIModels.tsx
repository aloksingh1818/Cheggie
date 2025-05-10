import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, Settings, Activity } from "lucide-react";

export function AIModels() {
  const models = [
    {
      id: "gpt-4",
      name: "GPT-4",
      provider: "OpenAI",
      status: "active",
      credits: 5,
      maxTokens: 8192,
      responseTime: "1.2s"
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      status: "active",
      credits: 2,
      maxTokens: 4096,
      responseTime: "0.8s"
    },
    {
      id: "claude-3",
      name: "Claude 3",
      provider: "Anthropic",
      status: "active",
      credits: 4,
      maxTokens: 100000,
      responseTime: "1.5s"
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      status: "active",
      credits: 3,
      maxTokens: 32768,
      responseTime: "1.0s"
    }
  ];

  const stats = [
    {
      title: "Total Requests",
      value: "45,678",
      change: "+23%",
      icon: Activity
    },
    {
      title: "Success Rate",
      value: "99.8%",
      change: "+0.2%",
      icon: Zap
    },
    {
      title: "Average Response Time",
      value: "1.2s",
      change: "-15%",
      icon: Brain
    },
    {
      title: "Active Models",
      value: "4",
      change: "0%",
      icon: Settings
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
          <p className="text-muted-foreground">
            Manage and configure your AI models
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="models" className="space-y-4">
          <TabsList>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Available Models</CardTitle>
                  <Button>Add Model</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Credits/Request</TableHead>
                      <TableHead>Max Tokens</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell>{model.provider}</TableCell>
                        <TableCell>
                          <Badge
                            variant={model.status === "active" ? "default" : "secondary"}
                          >
                            {model.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{model.credits}</TableCell>
                        <TableCell>{model.maxTokens.toLocaleString()}</TableCell>
                        <TableCell>{model.responseTime}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Configure
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OpenAI API Key</label>
                    <div className="flex gap-2">
                      <Input type="password" value="sk-..." readOnly />
                      <Button variant="outline">Edit</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Anthropic API Key</label>
                    <div className="flex gap-2">
                      <Input type="password" value="sk-..." readOnly />
                      <Button variant="outline">Edit</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Google API Key</label>
                    <div className="flex gap-2">
                      <Input type="password" value="AI..." readOnly />
                      <Button variant="outline">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Enable Model Testing</label>
                      <p className="text-sm text-muted-foreground">
                        Test models before using them in production
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Auto-fallback</label>
                      <p className="text-sm text-muted-foreground">
                        Automatically fallback to alternative models
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Response Caching</label>
                      <p className="text-sm text-muted-foreground">
                        Cache responses to improve performance
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Usage by Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
