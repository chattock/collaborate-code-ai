import { ExternalLink, Github, Play, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import project images
import ukTradeImg from "@/assets/project-uk-trade.jpg";
import wordRelationsImg from "@/assets/project-word-relations.jpg";
import globalTempsImg from "@/assets/project-global-temps.jpg";
import climateMappingImg from "@/assets/project-climate-mapping.jpg";
import orstedImg from "@/assets/project-orsted.jpg";
import fashionEsgImg from "@/assets/project-fashion-esg.jpg";

const ProjectsSection = () => {
  const projects = [
    {
      title: "UK Trade in 1700s",
      image: ukTradeImg,
      buttons: [
        { label: "Website", icon: ExternalLink, url: "https://chattock.github.io/Edmond/" },
        { label: "Github", icon: Github, url: "https://github.com/chattock/Edmond" }
      ]
    },
    {
      title: "Word Relationship Project",
      image: wordRelationsImg,
      buttons: [
        { label: "Website", icon: ExternalLink, url: "https://chattock.github.io/Crisis/" },
        { label: "Github", icon: Github, url: "https://github.com/chattock/Crisis" }
      ]
    },
    {
      title: "Global Temperatures",
      image: globalTempsImg,
      buttons: [
        { label: "Video Demo", icon: Play, url: "https://www.youtube.com/watch?v=zUuyePLL3rw&t=165s" },
        { label: "Project", icon: FileText, url: "#", download: true },
        { label: "Github", icon: Github, url: "https://github.com/chattock/data-vis-essay/blob/main/How%20to%20use%20CIMP6%20Databass-Copy1.ipynb" }
      ]
    },
    {
      title: "Battle of the Skies Demo",
      image: climateMappingImg,
      buttons: [
        { label: "Website", icon: ExternalLink, url: "https://chattock.github.io/climate-mapping/" },
        { label: "Github", icon: Github, url: "https://github.com/chattock/climate-mapping" }
      ]
    },
    {
      title: "Ørsted Financial Analysis",
      image: orstedImg,
      buttons: [
        { label: "Report", icon: FileText, url: "#", download: true }
      ]
    },
    {
      title: "UK Fashion ESG Report",
      image: fashionEsgImg,
      buttons: [
        { label: "Report", icon: FileText, url: "#", download: true }
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
          <p className="text-lg text-muted-foreground mb-4">Browse My Recent</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video overflow-hidden">
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
                <div className="flex flex-wrap gap-2 justify-center">
                  {project.buttons.map((button, buttonIndex) => {
                    const Icon = button.icon;
                    return (
                      <Button
                        key={buttonIndex}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
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