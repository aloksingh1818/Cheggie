import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, History, TrendingUp } from "lucide-react";

export function Credits() {
  const creditPackages = [
    {
      name: "Basic",
      credits: 100,
      price: 9.99,
      popular: false,
      features: ["Basic AI model access", "Standard support", "30-day validity"]
    },
    {
      name: "Pro",
      credits: 500,
      price: 39.99,
      popular: true,
      features: ["All AI models access", "Priority support", "60-day validity", "Advanced analytics"]
    },
    {
      name: "Enterprise",
      credits: 2000,
      price: 149.99,
      popular: false,
      features: ["All AI models access", "24/7 support", "90-day validity", "Advanced analytics", "API access"]
    }
  ];

  const recentTransactions = [
    {
      id: "TRX001",
      type: "purchase",
      amount: 100,
      date: "2024-03-15",
      status: "completed"
    },
    {
      id: "TRX002",
      type: "usage",
      amount: -5,
      date: "2024-03-14",
      status: "completed"
    },
    {
      id: "TRX003",
      type: "refund",
      amount: 50,
      date: "2024-03-10",
      status: "completed"
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credits</h1>
          <p className="text-muted-foreground">
            Manage your credits and purchase more
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">150 credits</div>
              <p className="text-muted-foreground">Valid until Apr 15, 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45 credits</div>
              <p className="text-muted-foreground">Used in last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Usage Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+15%</div>
              <p className="text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {creditPackages.map((pkg) => (
                <Card key={pkg.name} className={pkg.popular ? "border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {pkg.name}
                      {pkg.popular && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">
                      ${pkg.price}
                      <span className="text-sm text-muted-foreground">/package</span>
                    </div>
                    <div className="text-xl font-semibold mb-4">
                      {pkg.credits} credits
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">Purchase</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === "purchase" ? "default" : "secondary"}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tx.status}</Badge>
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
