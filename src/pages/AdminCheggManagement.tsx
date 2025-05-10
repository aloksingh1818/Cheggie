import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { LogOut, Activity, MessageSquare, CreditCard, Settings } from "lucide-react";

const cheggFeatures = [
  {
    name: "Chegg Question Notifier Extension",
    description: "Get instant notifications for new Chegg questions matching your criteria.",
    details: "This extension allows you to receive real-time notifications whenever a new Chegg question matching your filters is posted. Stay ahead and never miss an opportunity to answer.",
    creditPrice: 5,
    active: true,
    creditsUsed: 120,
    users: ["user1@email.com", "user2@email.com", "user3@email.com"]
  },
  {
    name: "Chegg Anti AI Extension",
    description: "Bypass AI detection and ensure your solutions are accepted.",
    details: "This extension helps you format your answers in a way that bypasses Chegg's AI detection, increasing the chances of your solutions being accepted.",
    creditPrice: 8,
    active: false,
    creditsUsed: 80,
    users: ["user2@email.com", "user4@email.com"]
  },
  {
    name: "Chegg Auto Solution Paste Extension",
    description: "Automatically paste solutions to Chegg questions with one click.",
    details: "Quickly paste your prepared solutions into Chegg with a single click, saving time and reducing errors.",
    creditPrice: 4,
    active: true,
    creditsUsed: 60,
    users: ["user1@email.com", "user5@email.com"]
  },
  {
    name: "Chegg Upvote",
    description: "Easily upvote helpful solutions and boost their visibility.",
    details: "Support quality answers by upvoting them. This extension makes it easy to boost the best solutions.",
    creditPrice: 2,
    active: false,
    creditsUsed: 30,
    users: ["user3@email.com"]
  },
  {
    name: "Chegg Question Link Finder",
    description: "Quickly find and copy direct links to Chegg questions.",
    details: "Find and copy direct links to any Chegg question for easy sharing and reference.",
    creditPrice: 3,
    active: true,
    creditsUsed: 45,
    users: ["user1@email.com", "user2@email.com"]
  },
  {
    name: "Chegg Solution",
    description: "Access and manage all your Chegg solutions in one place.",
    details: "View, organize, and manage all your submitted Chegg solutions from a single dashboard.",
    creditPrice: 6,
    active: true,
    creditsUsed: 100,
    users: ["user3@email.com", "user6@email.com"]
  },
];

const pieColors = ["#22c55e", "#ef4444"];

function ExtensionModal({ open, onClose, feature }) {
  if (!open || !feature) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">{feature.name}</h2>
        <p className="mb-2 text-muted-foreground">{feature.description}</p>
        <div className="mb-4 text-sm">{feature.details}</div>
        <div className="mb-2 text-sm font-medium">Credit Price: <span className="text-primary font-bold">{feature.creditPrice} credits</span></div>
        <Badge variant={feature.active ? "success" : "destructive"}>
          {feature.active ? "Active" : "Inactive"}
        </Badge>
      </div>
    </div>
  );
}

export default function AdminCheggManagement() {
  const [features, setFeatures] = useState(cheggFeatures);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const toggleFeature = (index) => {
    setFeatures((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, active: !f.active } : f
      )
    );
  };

  const openModal = (feature) => {
    setSelectedFeature(feature);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFeature(null);
  };

  // Demo: Each question is mapped to an extension by index
  const questions = [
    {
      id: "Q001",
      title: "Calculus Integration Problem",
      extension: "Chegg Question Notifier Extension",
      status: "pending",
      createdAt: "2024-03-15",
      priority: "high",
      user: "user1@email.com",
      cheggIdName: "CHG-1001"
    },
    {
      id: "Q002",
      title: "Organic Chemistry Reaction",
      extension: "Chegg Anti AI Extension",
      status: "solved",
      createdAt: "2024-03-14",
      priority: "medium",
      user: "user2@email.com",
      cheggIdName: "CHG-1002"
    },
    {
      id: "Q003",
      title: "Physics Mechanics Question",
      extension: "Chegg Solution",
      status: "flagged",
      createdAt: "2024-03-13",
      priority: "low",
      user: "user3@email.com",
      cheggIdName: "CHG-1003"
    }
  ];

  const stats = [
    {
      title: "Total Questions",
      value: "1,234",
      change: "+12%",
      icon: BookOpen
    },
    {
      title: "Average Response Time",
      value: "2.5 min",
      change: "-15%",
      icon: Clock
    },
    {
      title: "Success Rate",
      value: "98%",
      change: "+2%",
      icon: CheckCircle
    },
    {
      title: "Flagged Questions",
      value: "23",
      change: "-5%",
      icon: AlertCircle
    }
  ];

  // Filter questions by extension name
  const filteredQuestions = filter === "all"
    ? questions
    : questions.filter(q => q.extension === filter);

  // Remove Chegg Management from navItems
  const navItems = [
    { name: "Dashboard", icon: Activity, path: "/admin" },
    { name: "Chatbot", icon: MessageSquare, path: "/admin/chatbot" },
    { name: "Credits", icon: CreditCard, path: "/admin/credits" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
                variant="ghost"
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
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chegg Management</h1>
            <p className="text-muted-foreground">
              Manage and track your Chegg questions and answers
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Chegg Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <Card
                  key={feature.name}
                  className="relative group transition-shadow hover:shadow-lg cursor-pointer hover:ring-2 hover:ring-primary"
                  onClick={() => openModal(feature)}
                  tabIndex={0}
                  onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && openModal(feature)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {feature.name}
                      {feature.active ? (
                        <Badge variant="success" className="ml-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                          <XCircle className="h-4 w-4" /> Inactive
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-muted-foreground">{feature.description}</p>
                    <div className="mb-2 text-sm font-medium">Credit Price: <span className="text-primary font-bold">{feature.creditPrice} credits</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Status:</span>
                      <Switch checked={feature.active} onCheckedChange={() => toggleFeature(idx)} />
                      <span className="text-xs">{feature.active ? "Active" : "Inactive"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

          {/* Analytics by extension with cool data visualization */}
          <div>
            <h2 className="text-xl font-bold mb-2 mt-4">Extension Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <Card key={feature.name + "-analytics"}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {feature.name}
                      <Badge variant={feature.active ? "success" : "destructive"}>
                        {feature.active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm font-medium">Credit Price: <span className="text-primary font-bold">{feature.creditPrice} credits</span></div>
                    <div className="mb-2 text-xs">Top Users:</div>
                    <ul className="mb-2 text-xs list-disc list-inside">
                      {feature.users.map((user) => (
                        <li key={user}>{user}</li>
                      ))}
                    </ul>
                    <div className="mb-2 text-xs">Total Credits Used: <span className="font-semibold">{feature.creditsUsed}</span></div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-1/2">
                        <ResponsiveContainer width="100%" height={80}>
                          <BarChart data={[{ name: feature.name, credits: feature.creditsUsed }]}
                            layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Bar dataKey="credits" fill="#6366f1" radius={[8, 8, 8, 8]} />
                            <RechartsTooltip />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center mt-1">Credits Used</div>
                      </div>
                      <div className="w-1/2">
                        <ResponsiveContainer width={80} height={80}>
                          <PieChart>
                            <Pie
                              data={[{ name: "Active", value: feature.active ? 1 : 0 }, { name: "Inactive", value: feature.active ? 0 : 1 }]}
                              dataKey="value"
                              cx="50%"
                              cy="50%"
                              innerRadius={20}
                              outerRadius={35}
                              fill="#8884d8"
                              paddingAngle={2}
                            >
                              {[
                                { name: "Active", value: feature.active ? 1 : 0 },
                                { name: "Inactive", value: feature.active ? 0 : 1 },
                              ].map((entry, i) => (
                                <Cell key={`cell-${i}`} fill={pieColors[i]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center mt-1">Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Tabs defaultValue="questions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="answers">Answers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Questions</CardTitle>
                    <Button>New Question</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Input placeholder="Search questions..." className="max-w-sm" />
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Filter by extension" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Extensions</SelectItem>
                        {features.map((feature) => (
                          <SelectItem key={feature.name} value={feature.name}>{feature.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Extension</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Credit Price</TableHead>
                        <TableHead>Chegg ID Name</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.map((question) => {
                        const feature = features.find(f => f.name === question.extension);
                        return (
                          <TableRow key={question.id}>
                            <TableCell>{question.id}</TableCell>
                            <TableCell>{question.title}</TableCell>
                            <TableCell>{question.extension}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  feature?.active
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {feature?.active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>{question.createdAt}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  question.priority === "high"
                                    ? "destructive"
                                    : question.priority === "medium"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {question.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{question.user}</TableCell>
                            <TableCell>{feature?.creditPrice ?? "-"}</TableCell>
                            <TableCell>{question.cheggIdName}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => openModal(feature)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="answers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Answers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question ID</TableHead>
                        <TableHead>Answer</TableHead>
                        <TableHead>Extension</TableHead>
                        <TableHead>Credits Used</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Q002</TableCell>
                        <TableCell className="max-w-md truncate">
                          The reaction proceeds through a nucleophilic substitution mechanism...
                        </TableCell>
                        <TableCell>Chegg Anti AI Extension</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>user2@email.com</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => openModal(features[1])}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Questions by Extension</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">Chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Credits Usage by Extension</CardTitle>
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
      </div>
    </div>
  );
} 