
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Globe, Terminal, Download, RotateCw } from "lucide-react";

export function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">Autosave</Label>
            <p className="text-xs text-muted-foreground">
              Automatically save changes as you work.
            </p>
          </div>
          <Switch id="autoSave" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showWelcome">Welcome Screen</Label>
            <p className="text-xs text-muted-foreground">
              Show welcome screen when application starts.
            </p>
          </div>
          <Switch id="showWelcome" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="telemetry">Usage Analytics</Label>
            <p className="text-xs text-muted-foreground">
              Send anonymous usage data to help improve the application.
            </p>
          </div>
          <Switch id="telemetry" defaultChecked />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Language & Region</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en-US">
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="fr-FR">French</SelectItem>
                <SelectItem value="de-DE">German</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="ja-JP">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Select defaultValue="America/New_York">
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select defaultValue="MM/DD/YYYY">
              <SelectTrigger id="dateFormat" className="w-full">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Performance</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="caching">Enable Caching</Label>
              <Switch id="caching" defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Cache responses and data to improve performance and reduce API calls.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Animation Speed</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">Slow</span>
              <Slider defaultValue={[75]} max={100} step={25} className="flex-1" />
              <span className="text-sm">Fast</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxConcurrentRequests">Max Concurrent Requests</Label>
            <Input id="maxConcurrentRequests" type="number" defaultValue="5" min="1" max="10" />
            <p className="text-xs text-muted-foreground">
              Maximum number of concurrent API requests. Higher values may improve speed but consume more resources.
            </p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Data Management</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm">Export Your Data</p>
            <p className="text-xs text-muted-foreground mb-2">
              Download a copy of all your data from the platform.
            </p>
            <Button variant="outline" className="w-full sm:w-auto flex gap-2 items-center">
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm">Clear Cache</p>
            <p className="text-xs text-muted-foreground mb-2">
              Clear all cached data to free up space. This won't delete any of your saved work.
            </p>
            <Button variant="outline" className="w-full sm:w-auto flex gap-2 items-center">
              <RotateCw className="h-4 w-4" /> Clear Cache
            </Button>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm">Delete Account</p>
            <p className="text-xs text-muted-foreground mb-2">
              Permanently delete your account and all associated data.
            </p>
            <Button variant="destructive" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
