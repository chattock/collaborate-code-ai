import { useState } from "react";
import { Download, Mail, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProject } from "@/contexts/ProjectContext";
import profilePic from "@/assets/profile-pic.jpg";

// WeChat icon as SVG component
const WeChatIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.172 4.203 3.002 5.55l-.568 2.273 2.896-1.455C6.336 15.118 7.518 15.278 8.691 15.278c.030 0 .058-.003.087-.003-.184-.592-.28-1.214-.28-1.854 0-3.726 3.214-6.74 7.194-6.74.30 0 .593.017.886.051C15.703 4.063 12.500 2.188 8.691 2.188z"/>
    <path d="M17.699 13.721c0-3.148-2.533-5.704-5.65-5.704-3.115 0-5.648 2.556-5.648 5.704 0 3.148 2.533 5.704 5.648 5.704.647 0 1.270-.102 1.846-.283l2.263 1.139-.443-1.776c1.543-1.048 2.484-2.76 2.484-4.784z"/>
  </svg>
);

const HeroSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();
  const { cvUrl, cvOriginalUrl } = useProject();
  
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
                      <div className="max-w-full overflow-auto">
                        <img 
                          src={cvUrl} 
                          alt="CV Preview"
                          className="w-full h-auto max-h-[600px] object-contain border rounded"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => {
                            const downloadUrl = cvOriginalUrl || cvUrl;
                            if (downloadUrl) {
                              const a = document.createElement('a');
                              a.href = downloadUrl;
                              a.download = 'CV';
                              a.target = '_blank';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }
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
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10 animate-pulse" onClick={scrollToContact}>
                <WeChatIcon size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;