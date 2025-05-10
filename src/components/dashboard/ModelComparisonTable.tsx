
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const modelData = [
  {
    name: "GPT-4o",
    provider: "OpenAI",
    usageRate: "High",
    costPerToken: "$0.0150",
    performance: "Excellent",
    status: "Active",
  },
  {
    name: "Claude 3 Opus",
    provider: "Anthropic",
    usageRate: "Medium",
    costPerToken: "$0.0180",
    performance: "Excellent",
    status: "Active",
  },
  {
    name: "Gemini Pro",
    provider: "Google",
    usageRate: "Medium",
    costPerToken: "$0.0120",
    performance: "Good",
    status: "Active",
  },
  {
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    usageRate: "Low",
    costPerToken: "$0.0090",
    performance: "Good",
    status: "Active",
  },
];

export function ModelComparisonTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Model</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Usage Rate</TableHead>
          <TableHead>Cost/Token</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {modelData.map((model) => (
          <TableRow key={model.name}>
            <TableCell className="font-medium">{model.name}</TableCell>
            <TableCell>{model.provider}</TableCell>
            <TableCell>{model.usageRate}</TableCell>
            <TableCell>{model.costPerToken}</TableCell>
            <TableCell>{model.performance}</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                {model.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
