
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "Generated response using GPT-4o",
    timestamp: "2 minutes ago",
    avatar: "/placeholder.svg",
    initials: "JD",
  },
  {
    id: 2,
    user: "Emma Smith",
    action: "Added 500 credits to account",
    timestamp: "10 minutes ago",
    avatar: "/placeholder.svg",
    initials: "ES",
  },
  {
    id: 3,
    user: "Alex Johnson",
    action: "Created a new Chegg account connection",
    timestamp: "25 minutes ago",
    avatar: "/placeholder.svg",
    initials: "AJ",
  },
  {
    id: 4,
    user: "Sarah Williams",
    action: "Compared responses between Claude and GPT-4o",
    timestamp: "1 hour ago",
    avatar: "/placeholder.svg",
    initials: "SW",
  },
  {
    id: 5,
    user: "Michael Brown",
    action: "Updated account settings",
    timestamp: "2 hours ago",
    avatar: "/placeholder.svg",
    initials: "MB",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.avatar} alt={activity.user} />
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.action}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{activity.user}</span>
              <span>•</span>
              <span>{activity.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
