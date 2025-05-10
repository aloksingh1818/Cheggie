import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

export function Questions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to solve quadratic equations?",
      subject: "Mathematics",
      status: "pending",
      createdAt: "2024-03-15"
    },
    {
      id: 2,
      title: "Explain photosynthesis process",
      subject: "Biology",
      status: "solved",
      createdAt: "2024-03-14"
    }
  ]);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
            <p className="text-muted-foreground">
              Manage your questions and track their status
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Question
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Questions</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search questions..." className="pl-8" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.title}</TableCell>
                    <TableCell>{question.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant={question.status === "solved" ? "success" : "secondary"}
                      >
                        {question.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.createdAt}</TableCell>
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
      </div>
    </Layout>
  );
} 