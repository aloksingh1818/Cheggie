import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Bot, CreditCard, Database, Key, Bell, RefreshCw, Link2, AlertCircle, UploadCloud, DownloadCloud, Lock, LogOut } from "lucide-react";

function AdminAdvancedSettings() {
  return (
    <div className="space-y-8">
      {/* User Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle><Users className="inline mr-2" />User Management</CardTitle>
          <CardDescription>Manage users, roles, and sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button variant="outline">Force Password Reset</Button>
            <Button variant="destructive">Ban User</Button>
            <Button variant="outline">Unban User</Button>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Set User Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">View Sessions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Credit & Usage Controls */}
      <Card>
        <CardHeader>
          <CardTitle><CreditCard className="inline mr-2" />Credit & Usage Controls</CardTitle>
          <CardDescription>Set global credit price, limits, and manage user credits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <Input type="number" placeholder="Global Credit Price (USD)" className="w-48" />
            <Input type="number" placeholder="Daily Credit Limit" className="w-48" />
            <Input type="number" placeholder="Monthly Credit Limit" className="w-48" />
            <Button variant="outline">Reset User Credits</Button>
            <Button variant="outline"><UploadCloud className="inline mr-1" />Export Credits</Button>
            <Button variant="outline"><DownloadCloud className="inline mr-1" />Import Credits</Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Model & Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle><Bot className="inline mr-2" />AI Model & Feature Toggles</CardTitle>
          <CardDescription>Enable or disable AI models and set defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <Switch id="openai" defaultChecked /> <label htmlFor="openai">OpenAI</label>
            <Switch id="gemini" defaultChecked /> <label htmlFor="gemini">Gemini</label>
            <Switch id="claude" defaultChecked /> <label htmlFor="claude">Claude</label>
            <Switch id="deepseek" /> <label htmlFor="deepseek">DeepSeek</label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Default AI Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
            <Switch id="chegg" defaultChecked /> <label htmlFor="chegg">Enable Chegg Features</label>
          </div>
        </CardContent>
      </Card>

      {/* System & Security */}
      <Card>
        <CardHeader>
          <CardTitle><Shield className="inline mr-2" />System & Security</CardTitle>
          <CardDescription>Manage system security, logs, and maintenance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <Button variant="outline"><Key className="inline mr-1" />Manage API Keys</Button>
            <Button variant="outline"><Database className="inline mr-1" />View System Logs</Button>
            <Button variant="outline"><AlertCircle className="inline mr-1" />View Audit Trail</Button>
            <Switch id="maintenance" /> <label htmlFor="maintenance">Enable Maintenance Mode</label>
            <Switch id="2fa" defaultChecked /> <label htmlFor="2fa">Require 2FA for Admins</label>
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Announcements */}
      <Card>
        <CardHeader>
          <CardTitle><Bell className="inline mr-2" />Notifications & Announcements</CardTitle>
          <CardDescription>Send announcements and configure system notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <Input placeholder="Announcement Message" className="w-96" />
            <Button variant="outline">Send Announcement</Button>
            <Switch id="systemNotifications" defaultChecked /> <label htmlFor="systemNotifications">Enable System Notifications</label>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle><RefreshCw className="inline mr-2" />Backup & Restore</CardTitle>
          <CardDescription>Export or import system data for backup and restore.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <Button variant="outline"><UploadCloud className="inline mr-1" />Export Data</Button>
            <Button variant="outline"><DownloadCloud className="inline mr-1" />Import Data</Button>
            <Button variant="outline"><Lock className="inline mr-1" />Trigger Manual Backup</Button>
            <Button variant="outline"><LogOut className="inline mr-1" />Restore from Backup</Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Management */}
      <Card>
        <CardHeader>
          <CardTitle><Link2 className="inline mr-2" />Integration Management</CardTitle>
          <CardDescription>Manage and configure third-party integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <Input placeholder="OpenAI API Key" className="w-80" />
            <Input placeholder="Google API Key" className="w-80" />
            <Input placeholder="Chegg API Key" className="w-80" />
            <Button variant="outline">Save Integration Keys</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminSettings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure admin-specific settings and advanced options.
        </p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general system settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Manage third-party service integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Admin Settings</CardTitle>
              <CardDescription>
                Configure advanced options available only to admin users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAdvancedSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 