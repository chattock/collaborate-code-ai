import { useState } from "react";
import { Menu, X, Languages, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isLoggedIn, isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  const navLinks = [
    { href: "#hero", label: t("nav.about") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const adminControls = (compact: boolean) => {
    if (!isLoggedIn) {
      return (
        <Button
          variant="ghost"
          size="sm"
          aria-label="Admin login"
          className="gap-1 text-muted-foreground"
          onClick={() => navigate('/auth')}
        >
          <User size={compact ? 14 : 16} />
        </Button>
      );
    }
    return (
      <div className="flex items-center gap-1">
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/admin')}
          >
            <LayoutDashboard size={compact ? 14 : 16} />
            {!compact && "Dashboard"}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          aria-label="Log out"
          onClick={() => logout()}
        >
          <LogOut size={compact ? 14 : 16} />
        </Button>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex justify-between items-center h-20 px-8 fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <button className="text-2xl font-bold text-primary" onClick={scrollToTop}>
          James Chattock
        </button>
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
          {adminControls(false)}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden flex justify-between items-center h-16 px-4 fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <button className="text-xl font-bold text-primary" onClick={scrollToTop}>
          James Chattock
        </button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1 text-sm font-medium"
          >
            <Languages size={14} />
            {language === 'en' ? '中文' : 'EN'}
          </Button>
          {adminControls(true)}
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
