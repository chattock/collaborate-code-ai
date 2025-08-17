import { Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-lg text-muted-foreground mb-4">Get in Touch</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Contact Me</h2>
        </div>

        <Card className="border-2">
          <CardContent className="p-8">
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Email Contact */}
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Email</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary hover:underline text-left break-all"
                    onClick={() => window.location.href = 'mailto:james.chattock@gmail.com'}
                  >
                    james.chattock@gmail.com
                  </Button>
                </div>
              </div>

              {/* LinkedIn Contact */}
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Linkedin size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">LinkedIn</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary hover:underline"
                    onClick={() => window.open('https://www.linkedin.com/in/james-chattock/', '_blank')}
                  >
                    LinkedIn Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;