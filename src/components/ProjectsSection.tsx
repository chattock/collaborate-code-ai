import { ExternalLink, Github, Play, FileText, ChevronDown, Globe, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProject } from "@/contexts/ProjectContext";


const ProjectsSection = () => {
  console.log('ProjectsSection rendering...');
  const { t, language } = useLanguage();
  console.log('Language context loaded');
  const { projects } = useProject();
  console.log('Project context loaded, projects:', projects);

  const getButtonIcon = (type: string) => {
    switch (type) {
      case 'website': return Globe;
      case 'github': return Github;
      case 'video': return Video;
      case 'report': return FileText;
      default: return ExternalLink;
    }
  };

  const getButtonLabel = (type: string) => {
    switch (type) {
      case 'website': return t("projects.website");
      case 'github': return t("projects.github");
      case 'video': return t("projects.video");
      case 'report': return t("projects.report");
      default: return type;
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-lg text-muted-foreground mb-4">{t("projects.browse")}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("projects.title")}</h2>
        </div>

        <div className="h-[600px] overflow-y-auto pr-2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={project.image}
                    alt={language === 'zh' ? project.titleZh : project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center line-clamp-2">
                    {language === 'zh' ? project.titleZh : project.title}
                  </CardTitle>
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
                            if (button.type === 'report' && button.url) {
                              // For reports, open the Supabase storage URL directly
                              window.open(button.url, '_blank');
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
        </div>

        {/* Scroll Arrow */}
        <div className="flex justify-center mt-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToServices}
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