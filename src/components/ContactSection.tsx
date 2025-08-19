import { Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import wechatIcon from "@/assets/wechat-icon.png";

// WeChat icon component
const WeChatIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <img 
    src={wechatIcon} 
    alt="WeChat" 
    width={size} 
    height={size} 
    className={className}
  />
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