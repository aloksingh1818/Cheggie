
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Daily usage data per model
const dailyUsageData = [
  { date: "2023-05-01", "GPT-4": 85, "GPT-3.5": 120, "Claude": 65, "Gemini": 45, "DeepSeek": 20 },
  { date: "2023-05-02", "GPT-4": 92, "GPT-3.5": 132, "Claude": 58, "Gemini": 52, "DeepSeek": 18 },
  { date: "2023-05-03", "GPT-4": 78, "GPT-3.5": 110, "Claude": 72, "Gemini": 48, "DeepSeek": 22 },
  { date: "2023-05-04", "GPT-4": 90, "GPT-3.5": 118, "Claude": 68, "Gemini": 56, "DeepSeek": 24 },
  { date: "2023-05-05", "GPT-4": 95, "GPT-3.5": 128, "Claude": 75, "Gemini": 60, "DeepSeek": 30 },
  { date: "2023-05-06", "GPT-4": 65, "GPT-3.5": 95, "Claude": 52, "Gemini": 42, "DeepSeek": 15 },
  { date: "2023-05-07", "GPT-4": 58, "GPT-3.5": 88, "Claude": 48, "Gemini": 38, "DeepSeek": 12 },
  { date: "2023-05-08", "GPT-4": 88, "GPT-3.5": 122, "Claude": 70, "Gemini": 58, "DeepSeek": 28 },
  { date: "2023-05-09", "GPT-4": 92, "GPT-3.5": 130, "Claude": 75, "Gemini": 62, "DeepSeek": 32 },
  { date: "2023-05-10", "GPT-4": 96, "GPT-3.5": 135, "Claude": 82, "Gemini": 68, "DeepSeek": 35 },
];

// Feature usage breakdown
const featureUsageData = [
  { name: "Chat", value: 42 },
  { name: "Chegg Questions", value: 28 },
  { name: "Code Generation", value: 15 },
  { name: "Document Analysis", value: 10 },
  { name: "Other", value: 5 },
];

// Model distribution
const modelDistributionData = [
  { name: "GPT-4", value: 35 },
  { name: "GPT-3.5", value: 42 },
  { name: "Claude", value: 15 },
  { name: "Gemini", value: 6 },
  { name: "DeepSeek", value: 2 },
];

// Credit usage data
const creditUsageData = [
  { date: "2023-05-01", credits: 320 },
  { date: "2023-05-02", credits: 356 },
  { date: "2023-05-03", credits: 298 },
  { date: "2023-05-04", credits: 340 },
  { date: "2023-05-05", credits: 385 },
  { date: "2023-05-06", credits: 250 },
  { date: "2023-05-07", credits: 220 },
  { date: "2023-05-08", credits: 362 },
  { date: "2023-05-09", credits: 395 },
  { date: "2023-05-10", credits: 425 },
];

// Detailed usage records
const usageRecords = [
  { id: 1, date: "2023-05-10", time: "14:32:15", model: "GPT-4", feature: "Chat", tokens: 1245, credits: 12, user: "alex@example.com" },
  { id: 2, date: "2023-05-10", time: "13:18:42", model: "Claude", feature: "Chegg", tokens: 980, credits: 8, user: "sarah@example.com" },
  { id: 3, date: "2023-05-10", time: "11:45:33", model: "GPT-3.5", feature: "Chat", tokens: 850, credits: 3, user: "alex@example.com" },
  { id: 4, date: "2023-05-10", time: "10:22:18", model: "Gemini", feature: "Code", tokens: 1120, credits: 6, user: "mike@example.com" },
  { id: 5, date: "2023-05-10", time: "09:05:42", model: "DeepSeek", feature: "Code", tokens: 1350, credits: 5, user: "mike@example.com" },
  { id: 6, date: "2023-05-09", time: "16:48:29", model: "GPT-4", feature: "Chat", tokens: 1180, credits: 10, user: "sarah@example.com" },
  { id: 7, date: "2023-05-09", time: "14:15:56", model: "GPT-3.5", feature: "Chegg", tokens: 920, credits: 3, user: "alex@example.com" },
  { id: 8, date: "2023-05-09", time: "11:32:44", model: "Claude", feature: "Chat", tokens: 1050, credits: 9, user: "mike@example.com" },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

export function ModelUsage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Usage Analytics</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Last 10 Days
          </Button>
          <Button size="sm">Export Data</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,458</div>
            <p className="text-xs text-muted-foreground mt-1">
              +18% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Credit Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,350</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from previous period
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
              -0.4s from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Used Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GPT-3.5</div>
            <p className="text-xs text-muted-foreground mt-1">
              42% of all requests
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Model Usage</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="records">Detailed Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dailyUsageData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                      <Area
                        type="monotone"
                        dataKey="GPT-4"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="GPT-3.5"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="Claude"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="Gemini"
                        stackId="1"
                        stroke="#ff8042"
                        fill="#ff8042"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="DeepSeek"
                        stackId="1"
                        stroke="#a4de6c"
                        fill="#a4de6c"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Credit Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={creditUsageData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                      <Line
                        type="monotone"
                        dataKey="credits"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feature Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={featureUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {featureUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-2">
                  <div className="grid grid-cols-3 gap-4">
                    {featureUsageData.map((entry, index) => (
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
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Distribution</CardTitle>
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
          </div>
        </TabsContent>
        
        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Model Usage Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyUsageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <Bar dataKey="GPT-4" fill="#8884d8" name="GPT-4" />
                    <Bar dataKey="GPT-3.5" fill="#82ca9d" name="GPT-3.5" />
                    <Bar dataKey="Claude" fill="#ffc658" name="Claude" />
                    <Bar dataKey="Gemini" fill="#ff8042" name="Gemini" />
                    <Bar dataKey="DeepSeek" fill="#a4de6c" name="DeepSeek" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Credit Cost</TableHead>
                      <TableHead>Avg. Response Time</TableHead>
                      <TableHead>Tokens Used</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">GPT-4</TableCell>
                      <TableCell>839 requests</TableCell>
                      <TableCell>6,712 credits</TableCell>
                      <TableCell>4.2s</TableCell>
                      <TableCell>950,430</TableCell>
                      <TableCell>35%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">GPT-3.5</TableCell>
                      <TableCell>1,078 requests</TableCell>
                      <TableCell>3,234 credits</TableCell>
                      <TableCell>1.8s</TableCell>
                      <TableCell>1,150,280</TableCell>
                      <TableCell>42%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Claude</TableCell>
                      <TableCell>365 requests</TableCell>
                      <TableCell>2,555 credits</TableCell>
                      <TableCell>3.5s</TableCell>
                      <TableCell>420,150</TableCell>
                      <TableCell>15%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Gemini</TableCell>
                      <TableCell>145 requests</TableCell>
                      <TableCell>725 credits</TableCell>
                      <TableCell>2.6s</TableCell>
                      <TableCell>185,500</TableCell>
                      <TableCell>6%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">DeepSeek</TableCell>
                      <TableCell>31 requests</TableCell>
                      <TableCell>124 credits</TableCell>
                      <TableCell>2.2s</TableCell>
                      <TableCell>42,350</TableCell>
                      <TableCell>2%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Usage Distribution by Feature</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={featureUsageData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid horizontal strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar 
                          dataKey="value" 
                          fill="#8884d8" 
                          background={{ fill: '#eee' }} 
                          radius={[0, 4, 4, 0]}
                        >
                          {featureUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Feature-Model Correlation</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Chat</span>
                        <span className="text-xs font-medium">GPT-3.5 (48%)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="flex h-full">
                          <div style={{ width: "48%" }} className="bg-blue-500"></div>
                          <div style={{ width: "32%" }} className="bg-purple-500"></div>
                          <div style={{ width: "20%" }} className="bg-green-500"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>GPT-3.5: 48%</span>
                        <span>GPT-4: 32%</span>
                        <span>Claude: 20%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Chegg Questions</span>
                        <span className="text-xs font-medium">GPT-4 (65%)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="flex h-full">
                          <div style={{ width: "65%" }} className="bg-purple-500"></div>
                          <div style={{ width: "25%" }} className="bg-green-500"></div>
                          <div style={{ width: "10%" }} className="bg-yellow-500"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>GPT-4: 65%</span>
                        <span>Claude: 25%</span>
                        <span>Gemini: 10%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Code Generation</span>
                        <span className="text-xs font-medium">DeepSeek (42%)</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="flex h-full">
                          <div style={{ width: "42%" }} className="bg-green-500"></div>
                          <div style={{ width: "38%" }} className="bg-purple-500"></div>
                          <div style={{ width: "20%" }} className="bg-blue-500"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>DeepSeek: 42%</span>
                        <span>GPT-4: 38%</span>
                        <span>GPT-3.5: 20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Primary Model</TableHead>
                      <TableHead>Avg. Credits</TableHead>
                      <TableHead>Success Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Chat</TableCell>
                      <TableCell>1,032 uses</TableCell>
                      <TableCell>GPT-3.5 (48%)</TableCell>
                      <TableCell>5.2 per use</TableCell>
                      <TableCell>98%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Chegg Questions</TableCell>
                      <TableCell>688 uses</TableCell>
                      <TableCell>GPT-4 (65%)</TableCell>
                      <TableCell>9.4 per use</TableCell>
                      <TableCell>95%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Code Generation</TableCell>
                      <TableCell>368 uses</TableCell>
                      <TableCell>DeepSeek (42%)</TableCell>
                      <TableCell>6.8 per use</TableCell>
                      <TableCell>92%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Document Analysis</TableCell>
                      <TableCell>245 uses</TableCell>
                      <TableCell>Claude (58%)</TableCell>
                      <TableCell>11.2 per use</TableCell>
                      <TableCell>94%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Other</TableCell>
                      <TableCell>122 uses</TableCell>
                      <TableCell>Mixed</TableCell>
                      <TableCell>7.5 per use</TableCell>
                      <TableCell>90%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Usage Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Feature</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">{record.date}</div>
                          <div className="text-xs text-muted-foreground">{record.time}</div>
                        </TableCell>
                        <TableCell>{record.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.model}</Badge>
                        </TableCell>
                        <TableCell>{record.feature}</TableCell>
                        <TableCell>{record.tokens}</TableCell>
                        <TableCell>{record.credits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing 8 of 2,458 records
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button>Export All Records</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
