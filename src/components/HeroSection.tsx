import { useState } from "react";
import { Download, Mail, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import profilePic from "@/assets/profile-pic.jpg";
const HeroSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();
  
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="hero" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-lg">
              <img src={profilePic} alt="James Chattock profile picture" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center lg:text-left max-w-lg">
            <p className="text-lg text-muted-foreground mb-2">{t("hero.hello")}</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t("hero.name")}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground font-semibold mb-8">{t("hero.title")}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="border-2 gap-2">
                    <Download size={20} />
                    {t("hero.cv")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("hero.cvTitle")}</DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-12 text-muted-foreground space-y-4">
                    <p>{t("hero.cvContent")}</p>
                    <p className="text-sm">{t("hero.cvDemo")}</p>
                    <Button className="gap-2" onClick={() => window.open('#', '_blank')}>
                      <Download size={20} />
                      {t("hero.downloadCV")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="lg" className="gap-2" onClick={scrollToContact}>
                <Mail size={20} />
                {t("hero.contactInfo")}
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10" onClick={() => window.open('https://www.linkedin.com/in/james-chattock/', '_blank')}>
                <Linkedin size={24} />
              </Button>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10" onClick={() => window.open('https://github.com/chattock', '_blank')}>
                <Github size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;