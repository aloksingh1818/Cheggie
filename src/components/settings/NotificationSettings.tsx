
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, CreditCard, Bot, Database, AlertCircle } from "lucide-react";

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Bell className="h-5 w-5" /> Notification Preferences
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Choose how and when you'd like to receive notifications from the system.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <div className="flex flex-col items-center text-center gap-2 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">In-App</h4>
              </div>
              <div className="flex items-center justify-center">
                <Switch id="inAppNotifications" defaultChecked />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col items-center text-center gap-2 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Email</h4>
              </div>
              <div className="flex items-center justify-center">
                <Switch id="emailNotifications" defaultChecked />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col items-center text-center gap-2 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Browser</h4>
              </div>
              <div className="flex items-center justify-center">
                <Switch id="browserNotifications" />
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Notification Categories</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <div>
                <Label htmlFor="aiNotifications">AI Models</Label>
                <p className="text-xs text-muted-foreground">
                  Updates about AI models and performance.
                </p>
              </div>
            </div>
            <Switch id="aiNotifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              <div>
                <Label htmlFor="creditNotifications">Credits & Billing</Label>
                <p className="text-xs text-muted-foreground">
                  Low credit alerts, billing updates, and purchases.
                </p>
              </div>
            </div>
            <Switch id="creditNotifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="cheggNotifications">Chegg Integration</Label>
                <p className="text-xs text-muted-foreground">
                  Chegg account status and usage notifications.
                </p>
              </div>
            </div>
            <Switch id="cheggNotifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <Label htmlFor="systemNotifications">System Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Critical system notifications and maintenance updates.
                </p>
              </div>
            </div>
            <Switch id="systemNotifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              <div>
                <Label htmlFor="marketingNotifications">Marketing & Tips</Label>
                <p className="text-xs text-muted-foreground">
                  Product updates, tips, and marketing communications.
                </p>
              </div>
            </div>
            <Switch id="marketingNotifications" />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Email Frequency</h3>
        <RadioGroup defaultValue="daily-digest" className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="real-time" id="real-time" />
            <div>
              <Label htmlFor="real-time" className="text-sm font-medium">Real-time</Label>
              <p className="text-xs text-muted-foreground">
                Receive emails immediately when notifications occur.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily-digest" id="daily-digest" />
            <div>
              <Label htmlFor="daily-digest" className="text-sm font-medium">Daily Digest</Label>
              <p className="text-xs text-muted-foreground">
                Receive a single email summarizing all notifications from the day.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly-summary" id="weekly-summary" />
            <div>
              <Label htmlFor="weekly-summary" className="text-sm font-medium">Weekly Summary</Label>
              <p className="text-xs text-muted-foreground">
                Receive a weekly summary of important notifications.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Quiet Hours</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="quietHours">Enable Quiet Hours</Label>
            <p className="text-xs text-muted-foreground">
              Pause notifications during specific hours.
            </p>
          </div>
          <Switch id="quietHours" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="quietHoursStart">Start Time</Label>
            <input
              type="time"
              id="quietHoursStart"
              defaultValue="22:00"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <Label htmlFor="quietHoursEnd">End Time</Label>
            <input
              type="time"
              id="quietHoursEnd"
              defaultValue="07:00"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button>Save Notification Preferences</Button>
      </div>
    </div>
  );
}
