
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function QuestionFilters() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Date Range</h3>
        <Select defaultValue="today">
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Source</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="chegg" defaultChecked />
            <Label htmlFor="chegg">
              Chegg
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="manual" defaultChecked />
            <Label htmlFor="manual">
              Manual Entry
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="api" defaultChecked />
            <Label htmlFor="api">
              API
            </Label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Subject</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Math</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Physics</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Chemistry</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Biology</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Computer Science</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Engineering</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Finance</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Literature</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">History</Badge>
          <Badge variant="secondary" className="cursor-pointer">+5 More</Badge>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">AI Model</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="gpt4" defaultChecked />
            <Label htmlFor="gpt4">GPT-4</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="claude" defaultChecked />
            <Label htmlFor="claude">Claude</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gemini" defaultChecked />
            <Label htmlFor="gemini">Gemini</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="deepseek" defaultChecked />
            <Label htmlFor="deepseek">DeepSeek</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gpt35" defaultChecked />
            <Label htmlFor="gpt35">GPT-3.5</Label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Credit Usage</h3>
        <Select defaultValue="any">
          <SelectTrigger>
            <SelectValue placeholder="Select credit range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="low">Low (1-5)</SelectItem>
            <SelectItem value="medium">Medium (6-10)</SelectItem>
            <SelectItem value="high">High (11+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-2">
        <Button variant="outline" className="w-full">Reset Filters</Button>
      </div>
    </div>
  );
}
