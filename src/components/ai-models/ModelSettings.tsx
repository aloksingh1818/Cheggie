
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bot, Key, Shield, Settings } from "lucide-react";

export function ModelSettings() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API & Keys</TabsTrigger>
          <TabsTrigger value="defaults">Default Models</TabsTrigger>
          <TabsTrigger value="routing">Model Routing</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" /> OpenAI Configuration
                </CardTitle>
                <CardDescription>
                  Configure API settings for OpenAI models (GPT-4, GPT-3.5)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">API Key</Label>
                    <Input id="openai-key" type="password" placeholder="sk-..." />
                    <p className="text-xs text-muted-foreground">
                      Your OpenAI API key for authentication
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openai-org">Organization ID (Optional)</Label>
                    <Input id="openai-org" placeholder="org-..." />
                    <p className="text-xs text-muted-foreground">
                      Your OpenAI organization ID if applicable
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openai-endpoint">API Endpoint</Label>
                  <Input id="openai-endpoint" defaultValue="https://api.openai.com/v1" />
                  <p className="text-xs text-muted-foreground">
                    The endpoint for OpenAI API requests
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="openai-enable" defaultChecked />
                    <Label htmlFor="openai-enable">Enable OpenAI models</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">GPT-4 Available</Badge>
                    <Badge variant="outline">GPT-3.5 Available</Badge>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">Test Connection</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" /> Anthropic Configuration
                </CardTitle>
                <CardDescription>
                  Configure API settings for Anthropic models (Claude)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">API Key</Label>
                  <Input id="anthropic-key" type="password" placeholder="sk_ant-..." />
                  <p className="text-xs text-muted-foreground">
                    Your Anthropic API key for authentication
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="anthropic-endpoint">API Endpoint</Label>
                  <Input id="anthropic-endpoint" defaultValue="https://api.anthropic.com" />
                  <p className="text-xs text-muted-foreground">
                    The endpoint for Anthropic API requests
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="anthropic-enable" defaultChecked />
                    <Label htmlFor="anthropic-enable">Enable Anthropic models</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Claude 3 Available</Badge>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">Test Connection</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" /> Google AI Configuration
                </CardTitle>
                <CardDescription>
                  Configure API settings for Google AI models (Gemini)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-key">API Key</Label>
                  <Input id="google-key" type="password" placeholder="AIza..." />
                  <p className="text-xs text-muted-foreground">
                    Your Google AI API key for authentication
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="google-project">Project ID</Label>
                  <Input id="google-project" placeholder="your-project-id" />
                  <p className="text-xs text-muted-foreground">
                    Your Google Cloud project ID
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="google-enable" defaultChecked />
                    <Label htmlFor="google-enable">Enable Google AI models</Label>
                  </div>
                  <Badge variant="outline">Gemini Pro Available</Badge>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">Test Connection</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" /> DeepSeek Configuration
                </CardTitle>
                <CardDescription>
                  Configure API settings for DeepSeek models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deepseek-key">API Key</Label>
                  <Input id="deepseek-key" type="password" placeholder="dsk_..." />
                  <p className="text-xs text-muted-foreground">
                    Your DeepSeek API key for authentication
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deepseek-endpoint">API Endpoint</Label>
                  <Input id="deepseek-endpoint" defaultValue="https://api.deepseek.com" />
                  <p className="text-xs text-muted-foreground">
                    The endpoint for DeepSeek API requests
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="deepseek-enable" />
                    <Label htmlFor="deepseek-enable">Enable DeepSeek models</Label>
                  </div>
                  <Badge variant="secondary">Not Connected</Badge>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">Test Connection</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="defaults">
          <Card>
            <CardHeader>
              <CardTitle>Default Model Settings</CardTitle>
              <CardDescription>
                Configure which models are used by default for different tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-chat">Default Chat Model</Label>
                  <Select defaultValue="gpt4">
                    <SelectTrigger id="default-chat">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude">Claude 3</SelectItem>
                      <SelectItem value="gemini">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used for general chat conversations
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-code">Default Code Model</Label>
                  <Select defaultValue="deepseek">
                    <SelectTrigger id="default-code">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepseek">DeepSeek Coder</SelectItem>
                      <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                      <SelectItem value="claude">Claude 3</SelectItem>
                      <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used for code generation and technical tasks
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-chegg">Default Chegg Model</Label>
                  <Select defaultValue="gpt4">
                    <SelectTrigger id="default-chegg">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                      <SelectItem value="claude">Claude 3</SelectItem>
                      <SelectItem value="gemini">Gemini Pro</SelectItem>
                      <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used for processing Chegg questions
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Model Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Default Temperature</Label>
                    <Input id="temperature" type="number" defaultValue="0.7" min="0" max="2" step="0.1" />
                    <p className="text-xs text-muted-foreground">
                      Controls randomness (0 = deterministic, 2 = maximum randomness)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="top-p">Default Top P</Label>
                    <Input id="top-p" type="number" defaultValue="0.9" min="0" max="1" step="0.05" />
                    <p className="text-xs text-muted-foreground">
                      Controls diversity via nucleus sampling
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">System Instructions</h3>
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">Default System Prompt</Label>
                  <Textarea 
                    id="system-prompt" 
                    rows={3}
                    placeholder="You are a helpful AI assistant..."
                    defaultValue="You are a helpful AI assistant that provides accurate, concise, and informative responses."
                  />
                  <p className="text-xs text-muted-foreground">
                    Default instructions provided to all models
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">Reset to Default</Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="routing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-4 w-4" /> Model Routing
              </CardTitle>
              <CardDescription>
                Configure intelligent routing of queries to appropriate models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="smart-routing-enable" defaultChecked />
                <Label htmlFor="smart-routing-enable" className="font-medium">Enable Smart Model Routing</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart routing automatically selects the most appropriate model for each query based on content and patterns.
              </p>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Routing Rules</h3>
                <div className="rounded-md border">
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Switch id="rule1" defaultChecked />
                        <span className="font-medium">Technical content routing</span>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Routes code-related queries to DeepSeek Coder or GPT-4
                    </p>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Switch id="rule2" defaultChecked />
                        <span className="font-medium">Mathematical queries</span>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Routes math-related queries to Gemini Pro
                    </p>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Switch id="rule3" defaultChecked />
                        <span className="font-medium">Creative writing</span>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Routes creative writing tasks to GPT-4 or Claude 3
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Switch id="rule4" />
                        <span className="font-medium">Cost optimization</span>
                      </div>
                      <Badge variant="secondary">Inactive</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Routes simple queries to GPT-3.5 to optimize credit usage
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add New Routing Rule
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="fallback-model">Fallback Model</Label>
                <Select defaultValue="gpt35">
                  <SelectTrigger id="fallback-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude">Claude 3</SelectItem>
                    <SelectItem value="gemini">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Used when no routing rule matches or routing is disabled
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Routing Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Advanced Settings
              </CardTitle>
              <CardDescription>
                Configure advanced options for AI model behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Request Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Response Tokens</Label>
                    <Input id="max-tokens" type="number" defaultValue="4096" min="1" max="32000" />
                    <p className="text-xs text-muted-foreground">
                      Maximum length of model responses in tokens
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                    <Input id="timeout" type="number" defaultValue="60" min="10" max="300" />
                    <p className="text-xs text-muted-foreground">
                      Maximum time to wait for model responses
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Content Filtering
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="content-filter" className="text-sm font-medium">Content Filter Level</Label>
                      <p className="text-xs text-muted-foreground">
                        Controls filtering of inappropriate or harmful content
                      </p>
                    </div>
                    <Select defaultValue="standard">
                      <SelectTrigger id="content-filter" className="w-[180px]">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="harmful-check" defaultChecked />
                    <Label htmlFor="harmful-check">Check responses for harmful content</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Caching & Performance</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="response-cache" defaultChecked />
                    <Label htmlFor="response-cache">Enable response caching</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cache identical queries to improve response time and reduce credit usage
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cache-ttl">Cache TTL (minutes)</Label>
                  <Input id="cache-ttl" type="number" defaultValue="60" min="1" max="1440" />
                  <p className="text-xs text-muted-foreground">
                    Time-to-live for cached responses
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="parallel-requests" defaultChecked />
                    <Label htmlFor="parallel-requests">Enable parallel model requests</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send requests to multiple models in parallel for comparison
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">Reset to Default</Button>
                <Button>Save Advanced Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
