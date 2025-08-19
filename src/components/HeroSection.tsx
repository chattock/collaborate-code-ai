import { useState } from "react";
import { Download, Mail, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProject } from "@/contexts/ProjectContext";
import profilePic from "@/assets/profile-pic.jpg";
const HeroSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();
  const { cvUrl } = useProject();
  
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
                  {cvUrl ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="font-medium">Curriculum Vitae</p>
                      </div>
                      <embed 
                        src={cvUrl} 
                        type="application/pdf" 
                        width="100%" 
                        height="600px" 
                      />
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = cvUrl;
                            a.download = 'CV.pdf';
                            a.target = '_blank';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                        >
                          <Download size={20} className="mr-2" />
                          {t("hero.downloadCV")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No CV uploaded yet.</p>
                      <p className="text-sm mt-2">Admin can upload a CV in the admin panel.</p>
                    </div>
                  )}
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