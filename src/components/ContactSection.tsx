import { Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

// WeChat icon as SVG component
const WeChatIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.172 4.203 3.002 5.55l-.568 2.273 2.896-1.455C6.336 15.118 7.518 15.278 8.691 15.278c.030 0 .058-.003.087-.003-.184-.592-.28-1.214-.28-1.854 0-3.726 3.214-6.74 7.194-6.74.30 0 .593.017.886.051C15.703 4.063 12.500 2.188 8.691 2.188z"/>
    <path d="M17.699 13.721c0-3.148-2.533-5.704-5.65-5.704-3.115 0-5.648 2.556-5.648 5.704 0 3.148 2.533 5.704 5.648 5.704.647 0 1.270-.102 1.846-.283l2.263 1.139-.443-1.776c1.543-1.048 2.484-2.76 2.484-4.784z"/>
  </svg>
);

const ContactSection = () => {
  const { t } = useLanguage();
  return <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-lg text-muted-foreground mb-4">{t("contact.getInTouch")}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("contact.title")}</h2>
        </div>

        <Card className="border-2">
          <CardContent className="p-8">
            <div className="grid sm:grid-cols-3 gap-8">
              {/* Email Contact */}
              <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{t("contact.email")}</p>
                  <Button variant="link" onClick={() => window.location.href = 'mailto:james.chattock@gmail.com'} className="h-auto p-0 text-primary hover:underline text-left break-all sm:text-sm text-xs">
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
                  <p className="font-semibold text-foreground mb-1">{t("contact.linkedin")}</p>
                  <Button variant="link" className="h-auto p-0 text-primary hover:underline" onClick={() => window.open('https://www.linkedin.com/in/james-chattock/', '_blank')}>
                    {t("contact.linkedinProfile")}
                  </Button>
                </div>
              </div>

              {/* WeChat Contact */}
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <WeChatIcon size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{t("contact.wechat")}</p>
                  <Button variant="link" className="h-auto p-0 text-primary hover:underline text-left" onClick={() => navigator.clipboard.writeText('chattock123')}>
                    chattock123
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default ContactSection;