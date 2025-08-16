import { Download, Mail, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import profilePic from "@/assets/profile-pic.jpg";

const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-lg">
              <img
                src={profilePic}
                alt="James Chattock profile picture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center lg:text-left max-w-lg">
            <p className="text-lg text-muted-foreground mb-2">Hello, I'm</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              James Chattock
            </h1>
            <p className="text-xl lg:text-2xl text-primary font-semibold mb-8">
              Data Scientist
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-2"
                onClick={() => window.open('#', '_blank')}
              >
                <Download size={20} />
                Download CV
              </Button>
              <Button
                size="lg"
                className="gap-2"
                onClick={scrollToContact}
              >
                <Mail size={20} />
                Contact Info
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10"
                onClick={() => window.open('https://www.linkedin.com/in/james-chattock/', '_blank')}
              >
                <Linkedin size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10"
                onClick={() => window.open('https://github.com/chattock', '_blank')}
              >
                <Github size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;