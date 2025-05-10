
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye, RotateCcw, Flag, Trash } from "lucide-react";

// Sample questions data
const questions = [
  {
    id: "Q-7852",
    title: "Calculate the eigenvalues of the given matrix",
    subject: "Linear Algebra",
    source: "Chegg",
    status: "solved",
    date: "May 10, 2023",
    time: "14:32",
    model: "GPT-4",
    credits: 12,
  },
  {
    id: "Q-7853",
    title: "Explain the significance of the Hardy-Weinberg equilibrium",
    subject: "Biology",
    source: "Chegg",
    status: "solved",
    date: "May 10, 2023",
    time: "15:45",
    model: "Claude",
    credits: 10,
  },
  {
    id: "Q-7854",
    title: "Find the limit of the function as x approaches infinity",
    subject: "Calculus",
    source: "Manual",
    status: "pending",
    date: "May 10, 2023",
    time: "16:12",
    model: "Pending",
    credits: 0,
  },
  {
    id: "Q-7855",
    title: "Analyze the theme of alienation in Kafka's Metamorphosis",
    subject: "Literature",
    source: "Chegg",
    status: "solved",
    date: "May 10, 2023",
    time: "16:28",
    model: "GPT-4",
    credits: 14,
  },
  {
    id: "Q-7856",
    title: "Implement a binary search tree in Java",
    subject: "Computer Science",
    source: "Manual",
    status: "solved",
    date: "May 10, 2023",
    time: "17:05",
    model: "DeepSeek",
    credits: 8,
  },
  {
    id: "Q-7857",
    title: "Derive the Navier-Stokes equations for fluid dynamics",
    subject: "Physics",
    source: "Chegg",
    status: "flagged",
    date: "May 10, 2023",
    time: "17:33",
    model: "Error",
    credits: 0,
  },
  {
    id: "Q-7858",
    title: "Analyze the financial statements of Tesla for the last fiscal year",
    subject: "Finance",
    source: "Manual",
    status: "pending",
    date: "May 10, 2023",
    time: "17:56",
    model: "Pending",
    credits: 0,
  },
];

// Status badge colors
const statusColors = {
  solved: "success",
  pending: "warning",
  flagged: "destructive",
};

// Filter questions based on status prop if provided
export function QuestionsList({ status }: { status?: string }) {
  const filteredQuestions = status ? questions.filter(q => q.status === status) : questions;

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{question.id}</TableCell>
                <TableCell>
                  <div className="max-w-[250px] truncate">{question.title}</div>
                </TableCell>
                <TableCell>{question.subject}</TableCell>
                <TableCell>{question.source}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusColors[question.status as keyof typeof statusColors]}
                  >
                    {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>{question.date}</div>
                  <div className="text-xs text-muted-foreground">{question.time}</div>
                </TableCell>
                <TableCell>
                  {question.model === "Pending" || question.model === "Error" ? (
                    <span className="text-muted-foreground">{question.model}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {question.model.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{question.model}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{question.credits}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      {question.status === "pending" && (
                        <DropdownMenuItem className="flex items-center">
                          <RotateCcw className="mr-2 h-4 w-4" /> Retry Processing
                        </DropdownMenuItem>
                      )}
                      {question.status !== "flagged" && (
                        <DropdownMenuItem className="flex items-center">
                          <Flag className="mr-2 h-4 w-4" /> Flag Question
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredQuestions.length}</strong> of <strong>{questions.length}</strong> questions
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
