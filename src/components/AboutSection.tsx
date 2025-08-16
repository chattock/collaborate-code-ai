import { useState } from "react";
import { Award, GraduationCap, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import aboutPic from "@/assets/about-pic.jpg";

const AboutSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-lg text-muted-foreground mb-4">Get To Know More</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">About Me</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Image */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={aboutPic}
                alt="Data science workspace"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* About Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Experience Card */}
              <Card className="text-center">
                <CardHeader className="pb-4">
                  <Award className="w-8 h-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-lg">Experience</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  <p>2+ Years experience working with Python, R, SQL, JavaScript and GIS.</p>
                  <p className="mt-2">My expertise combines data science proficiency and business acumen, with work experience in ESG reporting and a focus on Geographic data science.</p>
                </CardContent>
              </Card>

              {/* Education Card */}
              <Card className="text-center">
                <CardHeader className="pb-4">
                  <GraduationCap className="w-8 h-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-lg">Education</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                  <p>M.Sc. Geographic Data Science - London School of Economics</p>
                  <p>B.Sc. Chinese and Business Management - The University of Manchester</p>
                  <p>IBM Data Science Certified</p>
                </CardContent>
              </Card>
            </div>

            {/* CV Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-2"
                >
                  View CV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Curriculum Vitae</DialogTitle>
                </DialogHeader>
                <div className="text-center py-12 text-muted-foreground">
                  <p>CV content would be displayed here.</p>
                  <p className="text-sm mt-2">For the demo, this would show the actual CV image or PDF content.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Scroll Arrow */}
        <div className="flex justify-center mt-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToProjects}
            className="w-12 h-12 rounded-full hover:bg-primary/10"
          >
            <ChevronDown size={24} className="text-primary" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;