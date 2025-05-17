import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";
import { useAuth } from "@/hooks/useAuth";

// --- Mock Data ---
const initialExtensions = [
  {
    id: 1,
    name: "Chegg Question Notifier Extension",
    description: "Get instant notifications for new Chegg questions matching your criteria.",
    creditPrice: 5,
    active: true,
    creditsUsed: 120,
    users: ["user1@email.com", "user2@email.com", "user3@email.com"]
  },
  {
    id: 2,
    name: "Chegg Anti AI Extension",
    description: "Bypass AI detection and ensure your solutions are accepted.",
    creditPrice: 8,
    active: false,
    creditsUsed: 80,
    users: ["user2@email.com", "user4@email.com"]
  },
  {
    id: 3,
    name: "Chegg Auto Solution Paste Extension",
    description: "Automatically paste solutions to Chegg questions with one click.",
    creditPrice: 4,
    active: true,
    creditsUsed: 60,
    users: ["user1@email.com", "user5@email.com"]
  },
  {
    id: 4,
    name: "Chegg Upvote",
    description: "Easily upvote helpful solutions and boost their visibility.",
    creditPrice: 2,
    active: false,
    creditsUsed: 30,
    users: ["user3@email.com"]
  },
  {
    id: 5,
    name: "Chegg Question Link Finder",
    description: "Quickly find and copy direct links to Chegg questions.",
    creditPrice: 3,
    active: true,
    creditsUsed: 45,
    users: ["user1@email.com", "user2@email.com"]
  },
  {
    id: 6,
    name: "Chegg Solution",
    description: "Access and manage all your Chegg solutions in one place.",
    creditPrice: 6,
    active: true,
    creditsUsed: 100,
    users: ["user3@email.com", "user6@email.com"]
  }
];

const initialUsers = [
  {
    email: "user1@email.com",
    extensions: ["Chegg Question Notifier Extension", "Chegg Auto Solution Paste Extension", "Chegg Question Link Finder"],
    creditsUsed: 150,
    status: "active",
    cheggIdName: "CHG-1001",
    creditRemaining: 350
  },
  {
    email: "user2@email.com",
    extensions: ["Chegg Anti AI Extension", "Chegg Question Link Finder"],
    creditsUsed: 200,
    status: "active",
    cheggIdName: "CHG-1002",
    creditRemaining: 300
  },
  {
    email: "user3@email.com",
    extensions: ["Chegg Upvote", "Chegg Solution", "Chegg Question Notifier Extension"],
    creditsUsed: 120,
    status: "inactive",
    cheggIdName: "CHG-1003",
    creditRemaining: 180
  },
  {
    email: "user4@email.com",
    extensions: ["Chegg Anti AI Extension"],
    creditsUsed: 80,
    status: "active",
    cheggIdName: "CHG-1004",
    creditRemaining: 220
  },
  {
    email: "user5@email.com",
    extensions: ["Chegg Auto Solution Paste Extension"],
    creditsUsed: 60,
    status: "active",
    cheggIdName: "CHG-1005",
    creditRemaining: 140
  },
  {
    email: "user6@email.com",
    extensions: ["Chegg Solution"],
    creditsUsed: 100,
    status: "inactive",
    cheggIdName: "CHG-1006",
    creditRemaining: 200
  }
];

const pieColors = ["#22c55e", "#ef4444", "#3b82f6", "#f59e42", "#a855f7", "#10b981"];

// Add mock questions data for the enhanced user management table
const mockQuestions = [
  {
    id: "Q001",
    title: "Calculus Integration Problem",
    extension: "Chegg Question Notifier Extension",
    status: "Active",
    created: "2024-03-15",
    priority: "high",
    user: "user1@email.com",
    creditPrice: 5,
    cheggIdName: "CHG-1001"
  },
  {
    id: "Q002",
    title: "Organic Chemistry Reaction",
    extension: "Chegg Anti AI Extension",
    status: "Inactive",
    created: "2024-03-14",
    priority: "medium",
    user: "user2@email.com",
    creditPrice: 8,
    cheggIdName: "CHG-1002"
  },
  {
    id: "Q003",
    title: "Physics Mechanics Question",
    extension: "Chegg Solution",
    status: "Active",
    created: "2024-03-13",
    priority: "low",
    user: "user3@email.com",
    creditPrice: 6,
    cheggIdName: "CHG-1003"
  }
];

export default function CheggMaster() {
  const { user } = useAuth();
  const [extensions, setExtensions] = useState(initialExtensions);
  const [users, setUsers] = useState(initialUsers);
  const [editExt, setEditExt] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    id: "",
    title: "",
    extension: "",
    status: "",
    priority: "",
    user: "",
    creditPrice: "",
    cheggIdName: ""
  });

  const extensionOptions = Array.from(new Set(mockQuestions.map(q => q.extension)));
  const userOptions = Array.from(new Set(mockQuestions.map(q => q.user)));
  const priorityOptions = Array.from(new Set(mockQuestions.map(q => q.priority)));
  const statusOptions = Array.from(new Set(mockQuestions.map(q => q.status)));

  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(q =>
      (filters.id === "" || q.id.toLowerCase().includes(filters.id.toLowerCase())) &&
      (filters.title === "" || q.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.extension === "" || q.extension === filters.extension) &&
      (filters.status === "" || q.status === filters.status) &&
      (filters.priority === "" || q.priority === filters.priority) &&
      (filters.user === "" || q.user === filters.user) &&
      (filters.creditPrice === "" || String(q.creditPrice).includes(filters.creditPrice)) &&
      (filters.cheggIdName === "" || q.cheggIdName.toLowerCase().includes(filters.cheggIdName.toLowerCase()))
    );
  }, [filters]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // --- Extension Handlers ---
  const toggleStatus = (id) => {
    setExtensions(extensions.map(ext =>
      ext.id === id ? { ...ext, active: !ext.active } : ext
    ));
  };

  const openEditModal = (ext) => {
    setEditExt(ext);
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    setExtensions(extensions.map(ext =>
      ext.id === editExt.id ? editExt : ext
    ));
    setEditModalOpen(false);
  };

  const deleteExtension = (id) => {
    setExtensions(extensions.filter(ext => ext.id !== id));
  };

  const openAddModal = () => {
    // Implement modal for adding extension
    alert("Open add extension modal");
  };

  // --- User Handlers (for inline editing) ---
  const handleUserCreditChange = (email, value) => {
    setUsers(users.map(u =>
      u.email === email ? { ...u, creditsUsed: Number(value) } : u
    ));
  };

  const handleUserCreditRemainingChange = (email, value) => {
    setUsers(users.map(u =>
      u.email === email ? { ...u, creditRemaining: Number(value) } : u
    ));
  };

  const handleUserStatusChange = (email, checked) => {
    setUsers(users.map(u =>
      u.email === email ? { ...u, status: checked ? "active" : "inactive" } : u
    ));
  };

  // --- Data for Charts ---
  const extensionUsageData = extensions.map(ext => ({
    name: ext.name,
    users: ext.users.length,
    credits: ext.creditsUsed
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.name}</h1>
      <p className="text-muted-foreground">Full control over all Chegg extensions and users</p>

      {/* Extension Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {extensions.map(ext => (
          <Card key={ext.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {ext.name}
                <Badge variant={ext.active ? "success" : "destructive"}>
                  {ext.active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-muted-foreground">{ext.description}</p>
              <div className="mb-2 text-sm font-medium">
                Credit Price: {" "}
                <Input
                  type="number"
                  value={ext.creditPrice}
                  onChange={e =>
                    setExtensions(extensions.map(ex =>
                      ex.id === ext.id
                        ? { ...ex, creditPrice: Number(e.target.value) }
                        : ex
                    ))
                  }
                  className="w-20 inline-block"
                /> {" "}
                credits
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Status:</span>
                <Switch checked={ext.active} onCheckedChange={() => toggleStatus(ext.id)} />
              </div>
              {/* Admin Controls */}
              <div className="flex gap-2 mt-2">
                <Button onClick={() => openEditModal(ext)} size="sm" variant="outline">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button onClick={() => deleteExtension(ext.id)} size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* Add Extension Card */}
        <Card className="flex items-center justify-center cursor-pointer" onClick={openAddModal}>
          <CardContent className="flex flex-col items-center">
            <Plus className="h-8 w-8 text-primary" />
            <div>Add Extension</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization Section */}
      <h2 className="text-2xl font-bold mt-8">Extension Usage Analytics</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users per Extension</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={extensionUsageData}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="users" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Credits Used per Extension</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={extensionUsageData}
                  dataKey="credits"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {extensionUsageData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <h2 className="text-2xl font-bold mt-8">Extension Analytics</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {extensions.map(ext => (
          <Card key={ext.id + "-analytics"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {ext.name}
                <Badge variant={ext.active ? "success" : "destructive"}>
                  {ext.active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm font-medium">
                Credit Price: <span className="text-primary font-bold">{ext.creditPrice} credits</span>
              </div>
              <div className="mb-2 text-sm">
                <strong>Top Users:</strong>
                <ul className="list-disc ml-5">
                  {ext.users.map(u => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-2 text-sm">
                <strong>Total Credits Used:</strong> {ext.creditsUsed}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Table */}
      <h2 className="text-2xl font-bold mt-8">User Management</h2>
      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            <Input placeholder="ID" value={filters.id} onChange={e => setFilters(f => ({ ...f, id: e.target.value }))} className="w-20 h-9 px-2 py-1 text-sm" />
            <Input placeholder="Title" value={filters.title} onChange={e => setFilters(f => ({ ...f, title: e.target.value }))} className="w-36 h-9 px-2 py-1 text-sm" />
            <select value={filters.extension} onChange={e => setFilters(f => ({ ...f, extension: e.target.value }))} className="border rounded px-2 py-1 h-9 text-sm w-32">
              <option value="">All Extensions</option>
              {extensionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="border rounded px-2 py-1 h-9 text-sm w-24">
              <option value="">All Status</option>
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} className="border rounded px-2 py-1 h-9 text-sm w-24">
              <option value="">All Priority</option>
              {priorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={filters.user} onChange={e => setFilters(f => ({ ...f, user: e.target.value }))} className="border rounded px-2 py-1 h-9 text-sm w-32">
              <option value="">All Users</option>
              {userOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <Input placeholder="Credit Price" value={filters.creditPrice} onChange={e => setFilters(f => ({ ...f, creditPrice: e.target.value }))} className="w-20 h-9 px-2 py-1 text-sm" />
            <Input placeholder="Chegg ID Name" value={filters.cheggIdName} onChange={e => setFilters(f => ({ ...f, cheggIdName: e.target.value }))} className="w-28 h-9 px-2 py-1 text-sm" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Extension</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Priority</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Credit Price</th>
                  <th className="p-2 text-left">Chegg ID Name</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map(q => (
                  <tr key={q.id}>
                    <td className="p-2">{q.id}</td>
                    <td className="p-2">{q.title}</td>
                    <td className="p-2">{q.extension}</td>
                    <td className="p-2">
                      <Badge variant={q.status === "Active" ? "success" : "destructive"}>{q.status}</Badge>
                    </td>
                    <td className="p-2">{q.created}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${q.priority === "high" ? "bg-red-100 text-red-700" : q.priority === "medium" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{q.priority}</span>
                    </td>
                    <td className="p-2">{q.user}</td>
                    <td className="p-2">{q.creditPrice}</td>
                    <td className="p-2">{q.cheggIdName}</td>
                    <td className="p-2">
                      <Button size="sm" variant="outline">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Extension Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Extension</DialogTitle>
          </DialogHeader>
          {editExt && (
            <div className="grid gap-4 py-4">
              <Input
                value={editExt.name}
                onChange={e => setEditExt({ ...editExt, name: e.target.value })}
                placeholder="Extension Name"
              />
              <Input
                value={editExt.description}
                onChange={e => setEditExt({ ...editExt, description: e.target.value })}
                placeholder="Description"
              />
              <Input
                type="number"
                value={editExt.creditPrice}
                onChange={e => setEditExt({ ...editExt, creditPrice: Number(e.target.value) })}
                placeholder="Credit Price"
              />
              <Switch
                checked={editExt.active}
                onCheckedChange={checked => setEditExt({ ...editExt, active: checked })}
              />
              <Button onClick={handleEditSave}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 