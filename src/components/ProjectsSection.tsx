import { ExternalLink, Github, FileText, ChevronDown, Globe, Video, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";

const ProjectsSection = () => {
  const { t, language } = useLanguage();
  const { projects, isLoading } = useProject();
  const navigate = useNavigate();

  const getButtonIcon = (type: string) => {
    switch (type) {
      case 'website': return Globe;
      case 'github': return Github;
      case 'video': return Video;
      case 'report': return FileText;
      case 'html': return Code;
      default: return ExternalLink;
    }
  };

  const getButtonLabel = (type: string) => {
    switch (type) {
      case 'website': return t("projects.website");
      case 'github': return t("projects.github");
      case 'video': return t("projects.video");
      case 'report': return t("projects.report");
      case 'html': return t("projects.html");
      default: return type;
    }
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="projects" className="py-20 px-4 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-lg text-muted-foreground mb-4">{t("projects.browse")}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("projects.title")}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full rounded-none" />
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-9" />
                      <Skeleton className="h-9" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={language === 'zh' ? project.titleZh : project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-center line-clamp-2">
                      {language === 'zh' ? project.titleZh : project.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      {language === 'zh' ? project.introductionZh : project.introduction}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      {project.buttons.map((button, buttonIndex) => {
                        const Icon = getButtonIcon(button.type);
                        const isLastOddButton = project.buttons.length % 2 === 1 && buttonIndex === project.buttons.length - 1;
                        return (
                          <Button
                            key={button.id}
                            variant="outline"
                            size="sm"
                            className={`gap-1.5 text-xs ${isLastOddButton ? 'col-span-2' : ''}`}
                            onClick={() => {
                              if (button.type === 'html' && button.url) {
                                const title = language === 'zh' ? project.titleZh : project.title;
                                navigate(`/html-viewer?url=${encodeURIComponent(button.url)}&title=${encodeURIComponent(title)}`);
                              } else if (button.url) {
                                window.open(button.url, '_blank');
                              }
                            }}
                          >
                            <Icon size={14} />
                            {button.label || getButtonLabel(button.type)}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Scroll Arrow */}
        <div className="flex justify-center mt-16">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Scroll to contact"
            onClick={scrollToContact}
            className="w-12 h-12 rounded-full hover:bg-primary/10"
          >
            <ChevronDown size={24} className="text-primary" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
