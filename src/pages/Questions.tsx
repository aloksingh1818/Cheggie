
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuestionsList } from "@/components/questions/QuestionsList";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { QuestionStats } from "@/components/questions/QuestionStats";
import { Search, Filter, Download } from "lucide-react";

export function Questions() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
            <p className="text-muted-foreground">
              Browse, filter, and manage questions processed by the system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button>Add Question</Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions by keyword, ID, or subject..."
              className="pl-10 pr-4"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
        
        <QuestionStats />
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="solved">
              Solved
              <Badge variant="secondary" className="ml-2">582</Badge>
            </TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged
              <Badge variant="secondary" className="ml-2">8</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">All Questions</CardTitle>
                <CardDescription>
                  View and manage all questions from various sources.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="md:w-1/4 space-y-4">
                    <QuestionFilters />
                  </div>
                  <div className="flex-1">
                    <QuestionsList />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Questions</CardTitle>
                <CardDescription>
                  Questions that are currently in queue or being processed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionsList status="pending" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="solved">
            <Card>
              <CardHeader>
                <CardTitle>Solved Questions</CardTitle>
                <CardDescription>
                  Questions that have been successfully answered.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionsList status="solved" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="flagged">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Questions</CardTitle>
                <CardDescription>
                  Questions that have been flagged for review or have issues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionsList status="flagged" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
