import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Settings, Activity, Shield, LogOut, MessageSquare, CreditCard, BookOpen } from "lucide-react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import AdminCheggManagement from "./AdminCheggManagement";
import CheggMaster from './admin/CheggMaster';
import { useAuth } from "@/hooks/useAuth";
import { AdminOpenAI } from "./admin/chatbot/OpenAI";
import { AdminGemini } from "./admin/chatbot/Gemini";
import { AdminClaude } from "./admin/chatbot/Claude";
import { AdminSettings } from "@/pages/admin/Settings";
import { AdminCredits } from "@/pages/admin/Credits";
import { AdminDeepSeek } from "./admin/chatbot/DeepSeek";
import { useEffect } from "react";

export function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users
    },
    {
      title: "Active Sessions",
      value: "45",
      change: "+5%",
      icon: Activity
    },
    {
      title: "Total Credits",
      value: "50,000",
      change: "+8%",
      icon: CreditCard
    },
    {
      title: "Chat Messages",
      value: "89,432",
      change: "+23%",
      icon: MessageSquare
    }
  ];

  const navItems = [
    { name: "Dashboard", icon: Activity, path: "/admin" },
    { name: "Chatbot", icon: MessageSquare, path: "/admin/chatbot" },
    { name: "Credits", icon: CreditCard, path: "/admin/credits" },
    { name: "Chegg Master", icon: BookOpen, path: "/admin/chegg-master" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-background border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="chegg-master" element={<CheggMaster />} />
          <Route path="chatbot" element={<AdminChatbot />} />
          <Route path="credits" element={<AdminCredits />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}

// Dashboard Component
function AdminDashboard() {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users
    },
    {
      title: "Active Sessions",
      value: "45",
      change: "+5%",
      icon: Activity
    },
    {
      title: "Total Credits",
      value: "50,000",
      change: "+8%",
      icon: CreditCard
    },
    {
      title: "Chat Messages",
      value: "89,432",
      change: "+23%",
      icon: MessageSquare
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.name || 'Admin'}</h1>
          <p className="text-muted-foreground">
            Manage users, monitor system, and configure settings
          </p>
        </div>
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

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot Features</TabsTrigger>
          <TabsTrigger value="credits">Credit Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button>Add User</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search users..." className="max-w-sm" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>john@example.com</TableCell>
                    <TableCell>
                      <Badge>user</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">active</Badge>
                    </TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable Chatbot</label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to access the chatbot feature
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable Credit System</label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to use credits for premium features
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Admin Chatbot Component
function AdminChatbot() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chatbot Management</h1>
        <p className="text-muted-foreground">
          Manage and configure AI chatbot settings
        </p>
      </div>
      <Tabs defaultValue="openai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="gemini">Gemini</TabsTrigger>
          <TabsTrigger value="claude">Claude</TabsTrigger>
          <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
        </TabsList>
        <TabsContent value="openai">
          <AdminOpenAI />
        </TabsContent>
        <TabsContent value="gemini">
          <AdminGemini />
        </TabsContent>
        <TabsContent value="claude">
          <AdminClaude />
        </TabsContent>
        <TabsContent value="deepseek">
          <AdminDeepSeek />
        </TabsContent>
      </Tabs>
    </div>
  );
}
