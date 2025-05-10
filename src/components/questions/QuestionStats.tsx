
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { Button } from "@/components/ui/button";

const statsData = [
  {
    name: "5/4",
    questions: 24,
    solved: 22,
    flagged: 2,
  },
  {
    name: "5/5",
    questions: 31,
    solved: 28,
    flagged: 3,
  },
  {
    name: "5/6",
    questions: 19,
    solved: 18,
    flagged: 1,
  },
  {
    name: "5/7",
    questions: 22,
    solved: 21,
    flagged: 1,
  },
  {
    name: "5/8",
    questions: 35,
    solved: 32,
    flagged: 3,
  },
  {
    name: "5/9",
    questions: 42,
    solved: 38,
    flagged: 4,
  },
  {
    name: "5/10",
    questions: 38,
    solved: 34,
    flagged: 4,
  },
];

export function QuestionStats() {
  const totalQuestions = statsData.reduce((acc, curr) => acc + curr.questions, 0);
  const totalSolved = statsData.reduce((acc, curr) => acc + curr.solved, 0);
  const totalFlagged = statsData.reduce((acc, curr) => acc + curr.flagged, 0);
  const averagePerDay = Math.round(totalQuestions / statsData.length);
  const successRate = Math.round((totalSolved / totalQuestions) * 100);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Question Activity</h3>
            <Button variant="outline" size="sm">Last 7 Days</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground mb-1">Total Questions</div>
              <div className="text-2xl font-bold">{totalQuestions}</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground mb-1">Successfully Solved</div>
              <div className="text-2xl font-bold">{totalSolved}</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground mb-1">Questions per Day</div>
              <div className="text-2xl font-bold">{averagePerDay}</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
              <div className="text-2xl font-bold">{successRate}%</div>
            </div>
          </div>
          
          <div className="h-64">
            <ChartContainer
              config={{
                questions: { label: "Total Questions", color: "#8884d8" },
                solved: { label: "Solved", color: "#82ca9d" },
                flagged: { label: "Flagged", color: "#ff8042" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Line
                    type="monotone"
                    dataKey="questions"
                    name="questions"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="solved"
                    name="solved"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="flagged"
                    name="flagged"
                    stroke="#ff8042"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
