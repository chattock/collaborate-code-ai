import { useEffect, useState } from "react";
import { Download, Mail, Loader2, User, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCv } from "@/hooks/useCv";
import { fetchAboutContent, cleanBullet, AboutContentRow, AboutSectionContent } from "@/lib/aboutContent";
import profilePic from "@/assets/profile-pic.jpg";

const INFO_SECTIONS = [
  { key: 'about', icon: User },
  { key: 'experience', icon: Briefcase },
  { key: 'education', icon: GraduationCap },
] as const;

const HeroSection = () => {
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { cvUrl, cvOriginalUrl, isLoading: cvLoading, hasLoaded: cvLoaded, load: loadCv } = useCv();
  const [aboutContent, setAboutContent] = useState<AboutContentRow[]>([]);
  const [aboutLoading, setAboutLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAboutContent()
      .then(rows => { if (!cancelled) setAboutContent(rows); })
      .catch(error => console.error('Error loading about content:', error))
      .finally(() => { if (!cancelled) setAboutLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const getSection = (section: string): AboutSectionContent | undefined => {
    const row = aboutContent.find(item => item.section === section);
    if (!row) return undefined;
    return language === 'zh' ? row.content_zh : row.content;
  };

  const activeSection = openSection ? getSection(openSection) : undefined;

  const handleCvDialogChange = (open: boolean) => {
    setIsCvOpen(open);
    if (open) loadCv();
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadCv = () => {
    const downloadUrl = cvOriginalUrl || cvUrl;
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'CV';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 py-20 scroll-mt-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-lg">
              <img
                src={profilePic}
                alt="James Chattock profile picture"
                width={768}
                height={768}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center lg:text-left max-w-lg">
            <p className="text-lg text-muted-foreground mb-2">{t("hero.hello")}</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
              {t("hero.name")}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Dialog open={isCvOpen} onOpenChange={handleCvDialogChange}>
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
                  {cvLoading || !cvLoaded ? (
                    <div className="flex items-center justify-center py-16 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : cvUrl ? (
                    <div className="space-y-4">
                      <div className="max-w-full overflow-auto">
                        <img src={cvUrl} alt="CV Preview" className="w-full h-auto max-h-[600px] object-contain border rounded" />
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={downloadCv}>
                          <Download size={20} className="mr-2" />
                          {t("hero.downloadCV")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>{t("hero.noCv")}</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button size="lg" className="gap-2" onClick={scrollToContact}>
                <Mail size={20} />
                {t("hero.contactInfo")}
              </Button>
            </div>

            {/* About / Experience / Education */}
            <div className="flex gap-4 justify-center lg:justify-start">
              {aboutLoading
                ? INFO_SECTIONS.map(({ key }) => <Skeleton key={key} className="w-12 h-12 rounded-full" />)
                : INFO_SECTIONS.map(({ key, icon: Icon }) => {
                    const section = getSection(key);
                    if (!section) return null;
                    return (
                      <Button
                        key={key}
                        variant="ghost"
                        size="icon"
                        aria-label={section.title}
                        title={section.title}
                        className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10"
                        onClick={() => setOpenSection(key)}
                      >
                        <Icon size={24} />
                      </Button>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* Info popup */}
        <Dialog open={!!openSection} onOpenChange={(open) => !open && setOpenSection(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{activeSection?.title}</DialogTitle>
            </DialogHeader>
            {activeSection && (
              (activeSection.paragraphs?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  {activeSection.paragraphs!.map((paragraph, index) => (
                    <p key={index} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {(activeSection.bullets ?? []).map((bullet, index) => (
                    <li key={index} className="flex gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      <span aria-hidden className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary/70 flex-shrink-0" />
                      <span>{cleanBullet(bullet)}</span>
                    </li>
                  ))}
                </ul>
              )
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default HeroSection;
