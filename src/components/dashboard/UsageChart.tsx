
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  {
    name: "Jan",
    OpenAI: 400,
    Claude: 240,
    Gemini: 320,
    DeepSeek: 180,
  },
  {
    name: "Feb",
    OpenAI: 500,
    Claude: 380,
    Gemini: 350,
    DeepSeek: 290,
  },
  {
    name: "Mar",
    OpenAI: 600,
    Claude: 420,
    Gemini: 480,
    DeepSeek: 310,
  },
  {
    name: "Apr",
    OpenAI: 780,
    Claude: 510,
    Gemini: 540,
    DeepSeek: 420,
  },
  {
    name: "May",
    OpenAI: 650,
    Claude: 530,
    Gemini: 490,
    DeepSeek: 380,
  },
  {
    name: "Jun",
    OpenAI: 700,
    Claude: 590,
    Gemini: 520,
    DeepSeek: 430,
  },
];

export function UsageChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            fontSize={12}
            tickLine={false} 
            axisLine={false}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Bar dataKey="OpenAI" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Claude" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Gemini" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="DeepSeek" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
