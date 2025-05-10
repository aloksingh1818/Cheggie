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

const cheggFeatures = [
  {
    name: "Chegg Question Notifier Extension",
    description: "Get instant notifications for new Chegg questions matching your criteria.",
    active: true,
  },
  {
    name: "Chegg Anti AI Extension",
    description: "Bypass AI detection and ensure your solutions are accepted.",
    active: false,
  },
  {
    name: "Chegg Auto Solution Paste Extension",
    description: "Automatically paste solutions to Chegg questions with one click.",
    active: true,
  },
  {
    name: "Chegg Upvote",
    description: "Easily upvote helpful solutions and boost their visibility.",
    active: false,
  },
  {
    name: "Chegg Question Link Finder",
    description: "Quickly find and copy direct links to Chegg questions.",
    active: true,
  },
  {
    name: "Chegg Solution",
    description: "Access and manage all your Chegg solutions in one place.",
    active: true,
  },
];

export default function CheggManagement() {
  const [features, setFeatures] = useState(cheggFeatures);

  const toggleFeature = (index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, active: !f.active } : f
      )
    );
  };

  const questions = [
    {
      id: "Q001",
      title: "Calculus Integration Problem",
      subject: "Mathematics",
      status: "pending",
      createdAt: "2024-03-15",
      priority: "high"
    },
    {
      id: "Q002",
      title: "Organic Chemistry Reaction",
      subject: "Chemistry",
      status: "solved",
      createdAt: "2024-03-14",
      priority: "medium"
    },
    {
      id: "Q003",
      title: "Physics Mechanics Question",
      subject: "Physics",
      status: "flagged",
      createdAt: "2024-03-13",
      priority: "low"
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

  return (
    <Layout>
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
              <Card key={feature.name} className="relative group transition-shadow hover:shadow-lg">
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
                  <p className="mb-4 text-muted-foreground">{feature.description}</p>
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
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="solved">Solved</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.id}</TableCell>
                        <TableCell>{question.title}</TableCell>
                        <TableCell>{question.subject}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              question.status === "solved"
                                ? "default"
                                : question.status === "flagged"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {question.status}
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
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
                      <TableHead>Model Used</TableHead>
                      <TableHead>Credits Used</TableHead>
                      <TableHead>Time Taken</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Q002</TableCell>
                      <TableCell className="max-w-md truncate">
                        The reaction proceeds through a nucleophilic substitution mechanism...
                      </TableCell>
                      <TableCell>GPT-4</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>1.2s</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
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
                  <CardTitle>Questions by Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Rate by Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Credits Usage</CardTitle>
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
