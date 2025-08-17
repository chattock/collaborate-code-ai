import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const navLinks = [
    { href: "#about", label: t("nav.about") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#services", label: t("nav.services") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-12 px-4 border-t border-border bg-muted/20">
      <div className="container mx-auto max-w-4xl">
        <nav className="mb-8">
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline underline-offset-4"
              >
                {link.label}
              </button>
            ))}
          </div>
        </nav>
        
        <div className="text-center text-muted-foreground">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;