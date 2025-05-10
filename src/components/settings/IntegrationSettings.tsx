
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Github,
  Slack,
  Mail,
  Calendar,
  Trello,
  Webhook,
  Link2,
  ExternalLink,
  Lock,
  CloudCog,
} from "lucide-react";

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Connected Services</h3>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub
                </CardTitle>
                <Badge>Connected</Badge>
              </div>
              <CardDescription>Sync and import repositories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Connected Account</p>
                  <p className="text-xs text-muted-foreground">github-username</p>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="githubSync">Auto-sync repositories</Label>
                </div>
                <Switch id="githubSync" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Slack className="h-5 w-5" />
                  Slack
                </CardTitle>
                <Badge variant="outline">Not Connected</Badge>
              </div>
              <CardDescription>Send notifications to Slack channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full sm:w-auto">
                Connect Slack
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Integration
                </CardTitle>
                <Badge>Connected</Badge>
              </div>
              <CardDescription>Send and receive content via email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Connected Email</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailDigest">Daily digest emails</Label>
                </div>
                <Switch id="emailDigest" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Google Calendar
                </CardTitle>
                <Badge variant="outline">Not Connected</Badge>
              </div>
              <CardDescription>Sync events and set reminders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full sm:w-auto">
                Connect Google Calendar
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trello className="h-5 w-5" />
                  Trello
                </CardTitle>
                <Badge variant="outline">Not Connected</Badge>
              </div>
              <CardDescription>Sync cards and manage tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full sm:w-auto">
                Connect Trello
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Webhook className="h-5 w-5" /> Webhooks
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure webhooks to send data to external services when events occur.
        </p>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Event Webhooks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="creditWebhook" className="font-medium text-sm">Credit Usage Webhook</Label>
                <Switch id="creditWebhook" />
              </div>
              <Input 
                id="creditWebhookUrl" 
                placeholder="https://example.com/webhook/credits" 
                className="text-sm"
              />
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Link2 className="h-3 w-3" />
                <span>Triggered when credit usage exceeds thresholds</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="aiModelWebhook" className="font-medium text-sm">AI Model Webhook</Label>
                <Switch id="aiModelWebhook" />
              </div>
              <Input 
                id="aiModelWebhookUrl" 
                placeholder="https://example.com/webhook/ai-models" 
                className="text-sm"
              />
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Link2 className="h-3 w-3" />
                <span>Triggered when AI models are updated or changed</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="cheggWebhook" className="font-medium text-sm">Chegg Account Webhook</Label>
                <Switch id="cheggWebhook" />
              </div>
              <Input 
                id="cheggWebhookUrl" 
                placeholder="https://example.com/webhook/chegg" 
                className="text-sm"
              />
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Link2 className="h-3 w-3" />
                <span>Triggered on Chegg account status changes</span>
              </div>
            </div>
            
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Webhook Documentation
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Lock className="h-5 w-5" /> API Access
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage API keys and access tokens for integrating with our services.
        </p>
        
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">API Keys</CardTitle>
            <CardDescription>
              Create and manage API keys for your integrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/50 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">Production Key</p>
                  <p className="text-xs text-muted-foreground">Created Apr 12, 2023</p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="flex items-center gap-2 bg-background rounded border px-3 py-2 text-sm font-mono">
                <p className="truncate flex-1">sk_live_••••••••••••••••••••••••••••••</p>
                <Button variant="ghost" size="sm" className="h-8 p-0 px-2">
                  <span className="sr-only">Copy</span>
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
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </Button>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">Revoke</Button>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">Create New API Key</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">OAuth Applications</CardTitle>
            <CardDescription>
              Manage OAuth applications for external integrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Custom Integration App</p>
                <Badge>Active</Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                <p>Client ID: client_••••••••••••••••</p>
                <p>Redirect URL: https://example.com/oauth/callback</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Delete</Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Register New OAuth App
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button>Save Integration Settings</Button>
      </div>
    </div>
  );
}
