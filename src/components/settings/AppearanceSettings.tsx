
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MoonStar, Sun, Laptop, Palette, Layout, LayoutGrid } from "lucide-react";

const colorThemes = [
  { id: "blue", name: "Blue", primary: "#2563eb", secondary: "#60a5fa" },
  { id: "green", name: "Green", primary: "#10b981", secondary: "#6ee7b7" },
  { id: "purple", name: "Purple", primary: "#8b5cf6", secondary: "#c4b5fd" },
  { id: "amber", name: "Amber", primary: "#f59e0b", secondary: "#fcd34d" },
  { id: "pink", name: "Pink", primary: "#ec4899", secondary: "#f9a8d4" },
];

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Theme Mode</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-2">
            <Card className="w-full h-24 flex items-center justify-center bg-background border-primary">
              <CardContent className="p-4 flex items-center justify-center">
                <Sun className="h-12 w-12 text-yellow-500" />
              </CardContent>
            </Card>
            <RadioGroup defaultValue="light" className="w-full grid grid-cols-1">
              <div className="flex items-center justify-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Card className="w-full h-24 flex items-center justify-center bg-background">
              <CardContent className="p-4 flex items-center justify-center">
                <MoonStar className="h-12 w-12 text-blue-500" />
              </CardContent>
            </Card>
            <RadioGroup defaultValue="light" className="w-full grid grid-cols-1">
              <div className="flex items-center justify-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Card className="w-full h-24 flex items-center justify-center bg-background">
              <CardContent className="p-4 flex items-center justify-center">
                <Laptop className="h-12 w-12 text-gray-500" />
              </CardContent>
            </Card>
            <RadioGroup defaultValue="light" className="w-full grid grid-cols-1">
              <div className="flex items-center justify-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <ThemeToggle />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Palette className="h-5 w-5" /> Color Scheme
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {colorThemes.map((theme) => (
            <Button
              key={theme.id}
              variant="outline"
              className={`h-auto flex-col items-center justify-center p-4 ${
                theme.id === 'blue' ? 'border-2 border-primary' : ''
              }`}
            >
              <div
                className="w-full h-8 rounded-md mb-2"
                style={{ 
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` 
                }}
              ></div>
              <span className="text-sm">{theme.name}</span>
              {theme.id === 'blue' && (
                <Badge variant="outline" className="mt-1">Current</Badge>
              )}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Customize the color scheme of the application. This will affect buttons, links, and other UI elements.
        </p>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Layout className="h-5 w-5" /> Layout & Display
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="density">Interface Density</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">Compact</span>
              <Slider defaultValue={[50]} max={100} step={50} className="flex-1" />
              <span className="text-sm">Comfortable</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="fontSize" className="w-full">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sidebarLayout">Default Sidebar Layout</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex-col gap-2 border-primary"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="text-xs">Expanded</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex-col gap-2"
                >
                  <Layout className="h-4 w-4" />
                  <span className="text-xs">Collapsed</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Interface Animations</Label>
              <p className="text-xs text-muted-foreground">
                Enable animations for smoother transitions.
              </p>
            </div>
            <Switch id="animations" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reducedMotion">Reduced Motion</Label>
              <p className="text-xs text-muted-foreground">
                Minimize animations for accessibility purposes.
              </p>
            </div>
            <Switch id="reducedMotion" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="contrast">High Contrast Mode</Label>
              <p className="text-xs text-muted-foreground">
                Increase contrast for better visibility.
              </p>
            </div>
            <Switch id="contrast" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button>Save Appearance</Button>
      </div>
    </div>
  );
}
