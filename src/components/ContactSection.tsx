import { Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import wechatIcon from "@/assets/wechat-icon.png";

const WeChatIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <img src={wechatIcon} alt="WeChat" width={size} height={size} className={className} />
);

const ContactSection = () => {
  const { t } = useLanguage();

  const copyWeChatId = async () => {
    try {
      await navigator.clipboard.writeText('chattock123');
      toast({ description: t("contact.copied") });
    } catch {
      // Clipboard unavailable — nothing else to do
    }
  };

  return (
    <section id="contact" className="py-20 px-4 scroll-mt-20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-lg text-muted-foreground mb-4">{t("contact.getInTouch")}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("contact.title")}</h2>
        </div>

        <Card className="border-2">
          <CardContent className="p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground mb-1">{t("contact.email")}</p>
                  <a
                    href="mailto:james.chattock@gmail.com"
                    className="text-primary hover:underline break-all text-xs sm:text-sm"
                  >
                    james.chattock@gmail.com
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Linkedin size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground mb-1">{t("contact.linkedin")}</p>
                  <a
                    href="https://www.linkedin.com/in/james-chattock/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline text-xs sm:text-sm"
                  >
                    {t("contact.linkedinProfile")}
                  </a>
                </div>
              </div>

              {/* WeChat */}
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <WeChatIcon size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground mb-1">{t("contact.wechat")}</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary hover:underline text-xs sm:text-sm"
                    onClick={copyWeChatId}
                  >
                    chattock123
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
