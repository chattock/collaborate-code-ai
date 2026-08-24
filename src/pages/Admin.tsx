import { Navigate, Link } from "react-router-dom";
import { ExternalLink, LogOut, Loader2, ShieldAlert, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/contexts/AdminContext";
import ProjectManagement from "@/components/admin/ProjectManagement";
import AboutContentManagement from "@/components/admin/AboutContentManagement";
import CVManagement from "@/components/admin/CVManagement";
import FaviconManagement from "@/components/admin/FaviconManagement";

const Admin = () => {
  const { isLoggedIn, isAdmin, isLoading, user, logout } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <ShieldAlert className="w-10 h-10 mx-auto text-destructive" />
            <p className="font-medium">This account doesn't have admin access.</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" asChild>
                <Link to="/">Back to site</Link>
              </Button>
              <Button variant="outline" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span>Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ExternalLink className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">View site</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <Tabs defaultValue="projects">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="site">Site</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectManagement />
          </TabsContent>
          <TabsContent value="about">
            <AboutContentManagement />
          </TabsContent>
          <TabsContent value="cv">
            <CVManagement />
          </TabsContent>
          <TabsContent value="site">
            <FaviconManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
