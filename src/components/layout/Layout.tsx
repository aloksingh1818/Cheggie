import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  BarChart3,
  Bot,
  Link,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      title: "Dashboard",
      icon: BarChart3,
      path: "/user",
    },
    {
      title: "Chatbot",
      icon: Bot,
      path: "/user/chatbot",
      submenu: [
        { title: "OpenAI", path: "/user/chatbot/openai" },
        { title: "DeepSeek", path: "/user/chatbot/deepseek" },
        { title: "Gemini", path: "/user/chatbot/gemini" },
        { title: "Claude", path: "/user/chatbot/claude" },
      ],
    },
    {
      title: "Chat",
      icon: MessageSquare,
      path: "/user/chat",
    },
    {
      title: "Credits",
      icon: CreditCard,
      path: "/user/credits",
    },
    {
      title: "Chegg Management",
      icon: Link,
      path: "/user/chegg-management",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/user/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Cheggie AI</h1>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => (
            <div key={item.path}>
              {item.submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={location.pathname.startsWith(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-between",
                        location.pathname.startsWith(item.path) && "bg-secondary"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.path}
                        onClick={() => navigate(subItem.path)}
                      >
                        {subItem.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    location.pathname === item.path && "bg-secondary"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="container mx-auto p-6">{children}</main>
      </div>
    </div>
  );
}
