
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, HelpCircle, Bookmark } from "lucide-react";

const modelComparison = [
  {
    id: "gpt4",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    accuracy: 92,
    responseTime: 4.2,
    costPerMessage: 8,
    contextWindow: 128000,
    strengths: ["Complex reasoning", "Instruction following", "Nuance", "Code generation"],
    weaknesses: ["Higher cost", "Slower response time"],
    bestFor: ["Research", "Complex problems", "Creative writing", "Detailed analysis"],
  },
  {
    id: "claude3",
    name: "Claude 3",
    provider: "Anthropic",
    accuracy: 91,
    responseTime: 3.5,
    costPerMessage: 7,
    contextWindow: 100000,
    strengths: ["Nuanced responses", "Reasoning", "Ethics", "Thoughtfulness"],
    weaknesses: ["Occasionally verbose", "Medium cost"],
    bestFor: ["Nuanced discussions", "Ethical considerations", "Balanced analysis"],
  },
  {
    id: "gemini",
    name: "Gemini Pro",
    provider: "Google",
    accuracy: 88,
    responseTime: 2.6,
    costPerMessage: 5,
    contextWindow: 32000,
    strengths: ["Math capabilities", "Factual knowledge", "Good balance"],
    weaknesses: ["Context handling", "Less creative"],
    bestFor: ["Mathematical problems", "Fact checking", "General knowledge"],
  },
  {
    id: "gpt35",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    accuracy: 85,
    responseTime: 1.8,
    costPerMessage: 3,
    contextWindow: 16000,
    strengths: ["Fast responses", "Cost efficiency", "General tasks"],
    weaknesses: ["Less nuanced", "Simpler reasoning", "Smaller context"],
    bestFor: ["Simple questions", "Basic tasks", "Quick interactions"],
  },
  {
    id: "deepseek",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    accuracy: 90,
    responseTime: 2.2,
    costPerMessage: 4,
    contextWindow: 32000,
    strengths: ["Code generation", "Technical knowledge", "Efficiency"],
    weaknesses: ["Less versatile", "Non-technical content"],
    bestFor: ["Programming tasks", "Technical documentation", "Code review"],
  },
];

// Data for comparison charts
const performanceData = [
  { name: "Accuracy", "GPT-4": 92, "Claude 3": 91, "Gemini": 88, "GPT-3.5": 85, "DeepSeek": 90 },
  { name: "Speed", "GPT-4": 6.8, "Claude 3": 7.5, "Gemini": 8.4, "GPT-3.5": 9.2, "DeepSeek": 8.8 },
  { name: "Reasoning", "GPT-4": 95, "Claude 3": 93, "Gemini": 87, "GPT-3.5": 80, "DeepSeek": 84 },
  { name: "Creativity", "GPT-4": 94, "Claude 3": 90, "Gemini": 85, "GPT-3.5": 82, "DeepSeek": 75 },
  { name: "Technical", "GPT-4": 90, "Claude 3": 86, "Gemini": 88, "GPT-3.5": 80, "DeepSeek": 96 },
];

const costEfficiencyData = [
  { name: "GPT-4", cost: 8, performance: 92, efficiency: 11.5 },
  { name: "Claude 3", cost: 7, performance: 91, efficiency: 13 },
  { name: "Gemini", cost: 5, performance: 88, efficiency: 17.6 },
  { name: "GPT-3.5", cost: 3, performance: 85, efficiency: 28.3 },
  { name: "DeepSeek", cost: 4, performance: 90, efficiency: 22.5 },
];

const taskSpecificData = [
  {
    "Task Type": "Creative Writing",
    "GPT-4": 95,
    "Claude 3": 92,
    "Gemini": 88,
    "GPT-3.5": 84,
    "DeepSeek": 78,
  },
  {
    "Task Type": "Mathematical Problems",
    "GPT-4": 90,
    "Claude 3": 87,
    "Gemini": 93,
    "GPT-3.5": 82,
    "DeepSeek": 88,
  },
  {
    "Task Type": "Code Generation",
    "GPT-4": 91,
    "Claude 3": 86,
    "Gemini": 89,
    "GPT-3.5": 83,
    "DeepSeek": 96,
  },
  {
    "Task Type": "Factual Q&A",
    "GPT-4": 89,
    "Claude 3": 90,
    "Gemini": 92,
    "GPT-3.5": 85,
    "DeepSeek": 84,
  },
];

export function ModelComparison() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table Comparison</TabsTrigger>
          <TabsTrigger value="charts">Performance Charts</TabsTrigger>
          <TabsTrigger value="efficiency">Cost Efficiency</TabsTrigger>
          <TabsTrigger value="tasks">Task-Specific</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead>Best For</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelComparison.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.provider}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={model.accuracy} className="w-16" />
                        <span>{model.accuracy}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{model.responseTime}s</TableCell>
                    <TableCell>{model.costPerMessage}</TableCell>
                    <TableCell>{(model.contextWindow / 1000)}K</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {model.bestFor.slice(0, 2).map((use, index) => (
                          <Badge key={index} variant="outline" className="whitespace-nowrap">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-4">Strengths & Weaknesses</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Strengths</TableHead>
                    <TableHead>Weaknesses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelComparison.map((model) => (
                    <TableRow key={`${model.id}-strengths`}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4 text-sm">
                          {model.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4 text-sm">
                          {model.weaknesses.map((weakness, index) => (
                            <li key={index}>{weakness}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recommendation Guide</h3>
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Use GPT-4 Turbo when:</h4>
                      <p className="text-sm text-muted-foreground">You need complex reasoning, detailed analysis, or high accuracy on challenging topics.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Use Claude 3 when:</h4>
                      <p className="text-sm text-muted-foreground">You need nuanced, thoughtful responses or handling of sensitive topics.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Use GPT-3.5 Turbo when:</h4>
                      <p className="text-sm text-muted-foreground">You need fast responses for general questions and cost efficiency is important.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Avoid DeepSeek for:</h4>
                      <p className="text-sm text-muted-foreground">General knowledge questions or creative writing tasks unrelated to technical topics.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Performance Comparison by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="GPT-4" fill="#8884d8" name="GPT-4" />
                    <Bar dataKey="Claude 3" fill="#82ca9d" name="Claude 3" />
                    <Bar dataKey="Gemini" fill="#ffc658" name="Gemini" />
                    <Bar dataKey="GPT-3.5" fill="#ff8042" name="GPT-3.5" />
                    <Bar dataKey="DeepSeek" fill="#8dd1e1" name="DeepSeek" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-3">
              {modelComparison.slice(0, 3).map((model) => (
                <Card key={`${model.id}-chart-card`} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{model.name}</h4>
                    <Badge variant="outline">{model.provider}</Badge>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-sm">Accuracy</span>
                      <div className="flex-1">
                        <Progress value={model.accuracy} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{model.accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-sm">Response</span>
                      <div className="flex-1">
                        <Progress value={Math.min(100, (10 - model.responseTime) * 12)} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{model.responseTime}s</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-sm">Cost</span>
                      <div className="flex-1">
                        <Progress value={Math.max(0, 100 - model.costPerMessage * 10)} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{model.costPerMessage} credits</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">View Details</Button>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="efficiency">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Cost-Efficiency Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={costEfficiencyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cost" fill="#8884d8" name="Cost (Credits)" />
                    <Bar yAxisId="left" dataKey="performance" fill="#82ca9d" name="Performance Score" />
                    <Bar yAxisId="right" dataKey="efficiency" fill="#ffc658" name="Efficiency Ratio" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Credits per Message</TableHead>
                    <TableHead>Performance Score</TableHead>
                    <TableHead>Efficiency Ratio</TableHead>
                    <TableHead>Best Value For</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costEfficiencyData.map((item) => (
                    <TableRow key={`${item.name}-efficiency`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.cost}</TableCell>
                      <TableCell>{item.performance}</TableCell>
                      <TableCell className="font-medium">{item.efficiency.toFixed(1)}</TableCell>
                      <TableCell>
                        {item.name === "GPT-4" && "High-complexity tasks"}
                        {item.name === "Claude 3" && "Nuanced content"}
                        {item.name === "Gemini" && "Balanced usage"}
                        {item.name === "GPT-3.5" && "General questions"}
                        {item.name === "DeepSeek" && "Technical content"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-muted/30 rounded-md border p-4">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Understanding Efficiency Ratio</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The efficiency ratio is calculated as (Performance Score ÷ Cost). A higher ratio indicates better value for the credits spent. GPT-3.5 Turbo provides the best overall efficiency, while GPT-4 offers superior performance at a higher cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Task-Specific Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskSpecificData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Task Type" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="GPT-4" fill="#8884d8" name="GPT-4" />
                    <Bar dataKey="Claude 3" fill="#82ca9d" name="Claude 3" />
                    <Bar dataKey="Gemini" fill="#ffc658" name="Gemini" />
                    <Bar dataKey="GPT-3.5" fill="#ff8042" name="GPT-3.5" />
                    <Bar dataKey="DeepSeek" fill="#8dd1e1" name="DeepSeek" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Recommendations by Task Type</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-md border p-2">
                    <Bookmark className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium">Creative Writing</h4>
                      <p className="text-xs text-muted-foreground">GPT-4 or Claude 3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-md border p-2">
                    <Bookmark className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="text-sm font-medium">Mathematical Problems</h4>
                      <p className="text-xs text-muted-foreground">Gemini or GPT-4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-md border p-2">
                    <Bookmark className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="text-sm font-medium">Code Generation</h4>
                      <p className="text-xs text-muted-foreground">DeepSeek or GPT-4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-md border p-2">
                    <Bookmark className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="text-sm font-medium">Factual Q&A</h4>
                      <p className="text-xs text-muted-foreground">Gemini or Claude 3</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-medium mb-4">Model Specialties</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">GPT-4 Turbo</h4>
                    <p className="text-xs text-muted-foreground">Best all-around performer, particularly excels in creative writing and complex reasoning tasks.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Claude 3</h4>
                    <p className="text-xs text-muted-foreground">Strong in nuanced content, ethical considerations, and factual accuracy.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Gemini Pro</h4>
                    <p className="text-xs text-muted-foreground">Outstanding in mathematical problems and factual questions with good overall balance.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">DeepSeek Coder</h4>
                    <p className="text-xs text-muted-foreground">Specialized for code generation and technical documentation with exceptional performance.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">GPT-3.5 Turbo</h4>
                    <p className="text-xs text-muted-foreground">Cost-efficient option for general purpose tasks with acceptable performance across categories.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
