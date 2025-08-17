import { ExternalLink, Github, Play, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

// Import project images
import ukTradeImg from "@/assets/project-uk-trade.jpg";
import wordRelationsImg from "@/assets/project-word-relations.jpg";
import globalTempsImg from "@/assets/project-global-temps.jpg";
import climateMappingImg from "@/assets/project-climate-mapping.jpg";
import orstedImg from "@/assets/project-orsted.jpg";
import fashionEsgImg from "@/assets/project-fashion-esg.jpg";
import retailAnalyticsImg from "@/assets/project-retail-analytics.jpg";
import mlNetworkImg from "@/assets/project-ml-network.jpg";
import propertyAnalysisImg from "@/assets/project-property-analysis.jpg";
import supplyChainImg from "@/assets/project-supply-chain.jpg";
import sentimentAnalysisImg from "@/assets/project-sentiment-analysis.jpg";
import portfolioOptimizerImg from "@/assets/project-portfolio-optimizer.jpg";

const ProjectsSection = () => {
  const { t } = useLanguage();
  const projects = [
    {
      title: t("projects.ukTrade"),
      image: ukTradeImg,
      buttons: [
        { label: t("projects.website"), icon: ExternalLink, url: "https://chattock.github.io/Edmond/" },
        { label: t("projects.github"), icon: Github, url: "https://github.com/chattock/Edmond" }
      ]
    },
    {
      title: t("projects.wordRelations"),
      image: wordRelationsImg,
      buttons: [
        { label: t("projects.website"), icon: ExternalLink, url: "https://chattock.github.io/Crisis/" },
        { label: t("projects.github"), icon: Github, url: "https://github.com/chattock/Crisis" }
      ]
    },
    {
      title: t("projects.globalTemps"),
      image: globalTempsImg,
      buttons: [
        { label: t("projects.videoDemo"), icon: Play, url: "https://www.youtube.com/watch?v=zUuyePLL3rw&t=165s" },
        { label: t("projects.project"), icon: FileText, url: "#", download: true },
        { label: t("projects.github"), icon: Github, url: "https://github.com/chattock/data-vis-essay/blob/main/How%20to%20use%20CIMP6%20Databass-Copy1.ipynb" }
      ]
    },
    {
      title: t("projects.battleSkies"),
      image: climateMappingImg,
      buttons: [
        { label: t("projects.website"), icon: ExternalLink, url: "https://chattock.github.io/climate-mapping/" },
        { label: t("projects.github"), icon: Github, url: "https://github.com/chattock/climate-mapping" }
      ]
    },
    {
      title: t("projects.orsted"),
      image: orstedImg,
      buttons: [
        { label: t("projects.report"), icon: FileText, url: "#", download: true }
      ]
    },
    {
      title: t("projects.fashionESG"),
      image: fashionEsgImg,
      buttons: [
        { label: t("projects.report"), icon: FileText, url: "#", download: true }
      ]
    },
    {
      title: t("projects.chineseDevelopment"),
      image: retailAnalyticsImg,
      buttons: [
        { label: t("projects.report"), icon: FileText, url: "#", download: true },
        { label: t("projects.website"), icon: ExternalLink, url: "#" }
      ]
    },
    {
      title: t("projects.californiaFires"),
      image: mlNetworkImg,
      buttons: [
        { label: t("projects.report"), icon: FileText, url: "#", download: true },
        { label: t("projects.github"), icon: Github, url: "#" }
      ]
    },
    {
      title: t("projects.glastonbury"),
      image: propertyAnalysisImg,
      buttons: [
        { label: t("projects.report"), icon: FileText, url: "#", download: true }
      ]
    },
    {
      title: t("projects.gentrification"),
      image: supplyChainImg,
      buttons: [
        { label: t("projects.website"), icon: ExternalLink, url: "#" }
      ]
    },
    {
      title: t("projects.elizabethLine"),
      image: sentimentAnalysisImg,
      buttons: [
        { label: t("projects.report"), icon: FileText, url: "#", download: true },
        { label: t("projects.website"), icon: ExternalLink, url: "#" }
      ]
    },
    {
      title: t("projects.portfolioOptimizer"),
      image: portfolioOptimizerImg,
      buttons: [
        { label: t("projects.github"), icon: Github, url: "#" }
      ]
    }
  ];

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
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center line-clamp-2">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {project.buttons.map((button, buttonIndex) => {
                      const Icon = button.icon;
                      const isLastOddButton = project.buttons.length % 2 === 1 && buttonIndex === project.buttons.length - 1;
                      return (
                        <Button
                          key={buttonIndex}
                          variant="outline"
                          size="sm"
                          className={`gap-1.5 text-xs ${isLastOddButton ? 'col-span-2' : ''}`}
                          onClick={() => {
                            if (button.download) {
                              // Handle download
                              console.log(`Download ${button.label} for ${project.title}`);
                            } else {
                              window.open(button.url, '_blank');
                            }
                          }}
                        >
                          <Icon size={14} />
                          {button.label}
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