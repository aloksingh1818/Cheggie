
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bot,
  CreditCard,
  Database,
  Home,
  MessageSquare,
  Search,
  Settings,
  Inbox,
  CircleUser,
  Building,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("pb-12 w-[270px] border-r bg-sidebar", className)}>
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-primary text-2xl">Cheggie</span>
        </Link>
      </div>
      <div className="px-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            className="w-full rounded-lg bg-muted/50 pl-8 pr-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Search..."
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)] px-3">
        <div className="flex flex-col gap-1 px-3 py-2">
          <h2 className="text-xs font-semibold text-muted-foreground py-2">
            Main Navigation
          </h2>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/chat">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/analytics">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/credits">
              <CreditCard className="h-4 w-4" />
              Credits
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-1 px-3 py-2">
          <h2 className="text-xs font-semibold text-muted-foreground py-2">
            AI Management
          </h2>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/ai-models">
              <Bot className="h-4 w-4" />
              AI Models
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/chegg-management">
              <Database className="h-4 w-4" />
              Chegg Management
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/questions">
              <Inbox className="h-4 w-4" />
              Questions
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-1 px-3 py-2">
          <h2 className="text-xs font-semibold text-muted-foreground py-2">
            Settings & Help
          </h2>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/account">
              <CircleUser className="h-4 w-4" />
              Account
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/admin">
              <Building className="h-4 w-4" />
              Admin
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            asChild
          >
            <Link to="/help">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Link>
          </Button>
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Credits</p>
            <p className="text-xs text-muted-foreground">1,250 / 2,000</p>
          </div>
          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/5 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
