import { useState } from "react";
import { Menu, X, Languages, User, LogOut, Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useAdminData } from "@/contexts/AdminDataContext";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import ProjectManagement from "./admin/ProjectManagement";
import CVManagement from "./admin/CVManagement";
import SkillsManagement from "./admin/SkillsManagement";
import AboutContentManagement from "./admin/AboutContentManagement";
import FaviconManagement from "./admin/FaviconManagement";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isLoggedIn, isAdmin, user, showBookingSection, logout, toggleBookingSection, hasUnsavedChanges: adminUnsavedChanges, saveChanges: saveAdminChanges } = useAdmin();
  const { hasUnsavedChanges: adminDataUnsavedChanges } = useAdminData();
  const { hasUnsavedChanges: projectUnsavedChanges, saveChanges: saveProjectChanges } = useProject();
  const navigate = useNavigate();

  const hasAnyUnsavedChanges = adminUnsavedChanges || adminDataUnsavedChanges || projectUnsavedChanges;

  const saveAllChanges = async () => {
    try {
      console.log('Saving all changes...');
      
      // Save all registered admin functions
      if (window.adminSaveFunctions) {
        const savePromises = Array.from(window.adminSaveFunctions).map(fn => fn());
        await Promise.all(savePromises);
      }

      // Save project and admin context changes
      await Promise.all([
        projectUnsavedChanges ? saveProjectChanges() : Promise.resolve(),
        adminUnsavedChanges ? saveAdminChanges() : Promise.resolve()
      ]);
      
      console.log('All changes saved successfully');
      alert('All changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "#hero", label: t("nav.about") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#services", label: t("nav.skills") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex justify-between items-center h-20 px-8 fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="text-2xl font-bold text-primary">James Chattock</div>
        <div className="flex gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-lg text-foreground hover:text-primary transition-colors duration-300 hover:underline underline-offset-4"
            >
              {link.label}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2 text-sm font-medium"
          >
            <Languages size={16} />
            {language === 'en' ? '中文' : 'EN'}
          </Button>
          
          {/* Admin Login/Controls */}
          {!isLoggedIn ? (
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleAuthClick}>
              <User size={16} />
              Admin Login
            </Button>
          ) : isAdmin ? (
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Settings size={16} />
                    Admin Panel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <div className="flex justify-between items-center">
                      <DialogTitle>Admin Panel</DialogTitle>
                      {hasAnyUnsavedChanges && (
                        <Button onClick={saveAllChanges} className="gap-2" size="sm">
                          <Save size={16} />
                          Save All Changes
                        </Button>
                      )}
                    </div>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <Switch
                        checked={showBookingSection}
                        onCheckedChange={toggleBookingSection}
                        className="h-4 w-7"
                      />
                      <span className="text-sm font-medium">Show Booking Section</span>
                    </div>
                    
                    <CVManagement />
                    <ProjectManagement />
                    <SkillsManagement />
                    <AboutContentManagement />
                    <FaviconManagement />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden flex justify-between items-center h-16 px-4 fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="text-xl font-bold text-primary">James Chattock</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1 text-sm font-medium"
          >
            <Languages size={14} />
            {language === 'en' ? '中文' : 'EN'}
          </Button>
          
          {/* Mobile Admin Controls */}
          {!isLoggedIn ? (
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleAuthClick}>
              <User size={14} />
            </Button>
          ) : isAdmin ? (
            <div className="flex items-center gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings size={14} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <div className="flex justify-between items-center">
                      <DialogTitle>Admin Panel</DialogTitle>
                      {hasAnyUnsavedChanges && (
                        <Button onClick={saveAllChanges} className="gap-2" size="sm">
                          <Save size={16} />
                          Save All
                        </Button>
                      )}
                    </div>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <Switch
                        checked={showBookingSection}
                        onCheckedChange={toggleBookingSection}
                        className="h-4 w-7"
                      />
                      <span className="text-sm font-medium">Show Booking Section</span>
                    </div>
                    
                    <CVManagement />
                    <ProjectManagement />
                    <SkillsManagement />
                    <AboutContentManagement />
                    <FaviconManagement />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={14} />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={14} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="relative z-50"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40 transition-all duration-300",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl text-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;