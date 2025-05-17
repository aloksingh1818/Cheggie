import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.name}</h1>
            <p className="text-muted-foreground">
              Manage your AI-powered learning experience
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Quick Stats</h2>
            <div className="space-y-2">
              <p>Available Credits: 90</p>
              <p>Questions Asked: 5</p>
              <p>Active Sessions: 1</p>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <div className="space-y-2">
              <p>Last Question: 2 hours ago</p>
              <p>Last Chat: 1 hour ago</p>
              <p>Credits Used Today: 10</p>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">System Status</h2>
            <div className="space-y-2">
              <p>AI Models: All Operational</p>
              <p>Chegg Integration: Connected</p>
              <p>Last Sync: 5 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
