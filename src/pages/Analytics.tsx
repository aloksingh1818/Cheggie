
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, Download, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Usage trend data
const usageTrendData = [
  { date: "2023-05-01", "AI Usage": 245, "Chegg": 145, "Credits": 420 },
  { date: "2023-05-02", "AI Usage": 285, "Chegg": 165, "Credits": 480 },
  { date: "2023-05-03", "AI Usage": 255, "Chegg": 140, "Credits": 425 },
  { date: "2023-05-04", "AI Usage": 290, "Chegg": 180, "Credits": 515 },
  { date: "2023-05-05", "AI Usage": 310, "Chegg": 195, "Credits": 550 },
  { date: "2023-05-06", "AI Usage": 220, "Chegg": 120, "Credits": 365 },
  { date: "2023-05-07", "AI Usage": 185, "Chegg": 105, "Credits": 310 },
  { date: "2023-05-08", "AI Usage": 275, "Chegg": 175, "Credits": 490 },
  { date: "2023-05-09", "AI Usage": 320, "Chegg": 210, "Credits": 580 },
  { date: "2023-05-10", "AI Usage": 350, "Chegg": 235, "Credits": 640 },
];

// Model distribution data
const modelDistributionData = [
  { name: "GPT-4", value: 35 },
  { name: "GPT-3.5", value: 42 },
  { name: "Claude", value: 15 },
  { name: "Gemini", value: 6 },
  { name: "DeepSeek", value: 2 },
];

// User activity data
const userActivityData = [
  { name: "Alex", usage: 124, credits: 385 },
  { name: "Sarah", usage: 98, credits: 310 },
  { name: "Michael", usage: 86, credits: 275 },
  { name: "Emma", usage: 65, credits: 220 },
  { name: "David", usage: 43, credits: 160 },
];

// Feature performance data
const featurePerformanceData = [
  { feature: "Chat", successRate: 98, avgResponseTime: 2.4, creditsPerUse: 5.2 },
  { feature: "Chegg Integration", successRate: 95, avgResponseTime: 4.1, creditsPerUse: 9.4 },
  { feature: "Code Generation", successRate: 92, avgResponseTime: 3.5, creditsPerUse: 6.8 },
  { feature: "Document Analysis", successRate: 94, avgResponseTime: 5.2, creditsPerUse: 11.2 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

export function Analytics() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Track usage, performance, and insights across your AI models.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Last 10 Days
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,458</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 dark:text-green-500 font-medium">↑ 18%</span> from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,350</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 dark:text-green-500 font-medium">↑ 12%</span> from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95.2%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 dark:text-green-500 font-medium">↑ 1.5%</span> from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.8s</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 dark:text-green-500 font-medium">↓ 0.4s</span> from previous period
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="features">Feature Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                  <CardDescription>
                    AI and Chegg usage over the past 10 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={usageTrendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="AI Usage" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="Chegg" stroke="#82ca9d" strokeWidth={2} />
                        <Line type="monotone" dataKey="Credits" stroke="#ffc658" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Model Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of AI model usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {modelDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="grid grid-cols-3 gap-4">
                      {modelDistributionData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center gap-1">
                          <div
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-xs">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Feature Performance</CardTitle>
                    <CardDescription>
                      Success rates and performance metrics by feature
                    </CardDescription>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Feature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Features</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="chegg">Chegg Integration</SelectItem>
                      <SelectItem value="code">Code Generation</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Feature</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Success Rate</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Avg. Response Time</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Credits per Use</th>
                          <th className="py-3 px-4 text-right text-sm font-medium">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {featurePerformanceData.map((feature, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4 font-medium">{feature.feature}</td>
                            <td className="py-3 px-4">
                              <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Operational
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{feature.successRate}%</td>
                            <td className="py-3 px-4">{feature.avgResponseTime}s</td>
                            <td className="py-3 px-4">{feature.creditsPerUse}</td>
                            <td className="py-3 px-4 text-right">
                              {index % 2 === 0 ? (
                                <span className="text-green-600">↑ Improving</span>
                              ) : (
                                <span className="text-amber-600">→ Stable</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Performance</CardTitle>
                <CardDescription>
                  Detailed analytics for each AI model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Model Comparison</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "Accuracy", "GPT-4": 92, "Claude": 91, "Gemini": 88, "GPT-3.5": 85, "DeepSeek": 90 },
                              { name: "Response Time", "GPT-4": 65, "Claude": 70, "Gemini": 80, "GPT-3.5": 92, "DeepSeek": 85 },
                              { name: "Cost Efficiency", "GPT-4": 75, "Claude": 80, "Gemini": 85, "GPT-3.5": 95, "DeepSeek": 85 },
                              { name: "Context Handling", "GPT-4": 95, "Claude": 92, "Gemini": 85, "GPT-3.5": 80, "DeepSeek": 82 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="GPT-4" fill="#8884d8" />
                            <Bar dataKey="Claude" fill="#82ca9d" />
                            <Bar dataKey="Gemini" fill="#ffc658" />
                            <Bar dataKey="GPT-3.5" fill="#ff8042" />
                            <Bar dataKey="DeepSeek" fill="#a4de6c" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Success Rate Comparison</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { category: "Overall", "GPT-4": 92, "Claude": 91, "Gemini": 88, "GPT-3.5": 85, "DeepSeek": 90 },
                              { category: "Technical", "GPT-4": 90, "Claude": 86, "Gemini": 88, "GPT-3.5": 80, "DeepSeek": 96 },
                              { category: "Creative", "GPT-4": 94, "Claude": 92, "Gemini": 85, "GPT-3.5": 82, "DeepSeek": 75 },
                              { category: "Factual", "GPT-4": 89, "Claude": 90, "Gemini": 92, "GPT-3.5": 85, "DeepSeek": 84 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="category" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="GPT-4" fill="#8884d8" />
                            <Bar dataKey="Claude" fill="#82ca9d" />
                            <Bar dataKey="Gemini" fill="#ffc658" />
                            <Bar dataKey="GPT-3.5" fill="#ff8042" />
                            <Bar dataKey="DeepSeek" fill="#a4de6c" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Model</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Usage</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Success Rate</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Avg. Response Time</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Credits Used</th>
                          <th className="py-3 px-4 text-right text-sm font-medium">Performance Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">GPT-4</td>
                          <td className="py-3 px-4">839 requests</td>
                          <td className="py-3 px-4">92%</td>
                          <td className="py-3 px-4">4.2s</td>
                          <td className="py-3 px-4">6,712</td>
                          <td className="py-3 px-4 text-right">
                            <Badge>A+</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">GPT-3.5</td>
                          <td className="py-3 px-4">1,078 requests</td>
                          <td className="py-3 px-4">85%</td>
                          <td className="py-3 px-4">1.8s</td>
                          <td className="py-3 px-4">3,234</td>
                          <td className="py-3 px-4 text-right">
                            <Badge>A</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Claude</td>
                          <td className="py-3 px-4">365 requests</td>
                          <td className="py-3 px-4">91%</td>
                          <td className="py-3 px-4">3.5s</td>
                          <td className="py-3 px-4">2,555</td>
                          <td className="py-3 px-4 text-right">
                            <Badge>A</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Gemini</td>
                          <td className="py-3 px-4">145 requests</td>
                          <td className="py-3 px-4">88%</td>
                          <td className="py-3 px-4">2.6s</td>
                          <td className="py-3 px-4">725</td>
                          <td className="py-3 px-4 text-right">
                            <Badge>B+</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">DeepSeek</td>
                          <td className="py-3 px-4">31 requests</td>
                          <td className="py-3 px-4">90%</td>
                          <td className="py-3 px-4">2.2s</td>
                          <td className="py-3 px-4">124</td>
                          <td className="py-3 px-4 text-right">
                            <Badge>A-</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>
                  Usage patterns and metrics by user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userActivityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="usage" name="Usage (Requests)" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="credits" name="Credits Used" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">User</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Requests</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Credits Used</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Preferred Model</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Common Use Case</th>
                          <th className="py-3 px-4 text-right text-sm font-medium">Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Alex Johnson</td>
                          <td className="py-3 px-4">124</td>
                          <td className="py-3 px-4">385</td>
                          <td className="py-3 px-4">GPT-4</td>
                          <td className="py-3 px-4">Chegg Questions</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              High
                            </Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Sarah Miller</td>
                          <td className="py-3 px-4">98</td>
                          <td className="py-3 px-4">310</td>
                          <td className="py-3 px-4">Claude</td>
                          <td className="py-3 px-4">Chat</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              High
                            </Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Michael Brown</td>
                          <td className="py-3 px-4">86</td>
                          <td className="py-3 px-4">275</td>
                          <td className="py-3 px-4">DeepSeek</td>
                          <td className="py-3 px-4">Code Generation</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="warning" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Medium
                            </Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Emma Davis</td>
                          <td className="py-3 px-4">65</td>
                          <td className="py-3 px-4">220</td>
                          <td className="py-3 px-4">GPT-3.5</td>
                          <td className="py-3 px-4">Chat</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="warning" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Medium
                            </Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">David Wilson</td>
                          <td className="py-3 px-4">43</td>
                          <td className="py-3 px-4">160</td>
                          <td className="py-3 px-4">GPT-3.5</td>
                          <td className="py-3 px-4">Chegg Questions</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="secondary">
                              Low
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Analysis</CardTitle>
                <CardDescription>
                  Performance and usage metrics by feature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Feature Usage Distribution</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={featurePerformanceData.map((feature) => ({
                              name: feature.feature,
                              value: feature.creditsPerUse * (100 - feature.successRate),
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {featurePerformanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Most Efficient Features</h4>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <span className="font-medium">Chat</span>
                          <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            98% Success
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-green-50/50 dark:bg-green-900/10 rounded-md">
                          <span className="font-medium">Document Analysis</span>
                          <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            94% Success
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Performance Metrics</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={featurePerformanceData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="feature" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="successRate" name="Success Rate" fill="#8884d8" />
                          <Bar dataKey="avgResponseTime" name="Avg Response Time (s)" fill="#82ca9d" />
                          <Bar dataKey="creditsPerUse" name="Credits per Use" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Areas for Improvement</h4>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                          <span className="font-medium">Code Generation</span>
                          <Badge variant="warning" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            92% Success
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-md">
                          <span className="font-medium">Document Analysis</span>
                          <Badge variant="warning" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            5.2s Avg. Response
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Detailed Feature Analytics</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chat Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Success Rate</span>
                            <span className="font-medium">98%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: "98%" }}></div>
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Model Preference</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">GPT-3.5 (48%)</Badge>
                            <Badge variant="outline">GPT-4 (32%)</Badge>
                            <Badge variant="outline">Claude (20%)</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chegg Integration Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Success Rate</span>
                            <span className="font-medium">95%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: "95%" }}></div>
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Model Preference</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">GPT-4 (65%)</Badge>
                            <Badge variant="outline">Claude (25%)</Badge>
                            <Badge variant="outline">Gemini (10%)</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
