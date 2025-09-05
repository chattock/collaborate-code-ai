import { Mail, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookingDialog } from "@/components/BookingDialog";
import wechatIcon from "@/assets/wechat-icon.png";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [showBookingSection, setShowBookingSection] = useState(true);
  const [paymentText, setPaymentText] = useState("Meetings are Free. Work outside of meetings are billed at £20 per hour.");
  const [paymentLink, setPaymentLink] = useState("https://buy.stripe.com/9AQ9Cv4mm2HgcEgcMM");

  // Load payment settings from Supabase
  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const { data: settings, error } = await supabase
          .from('admin_settings')
          .select('setting_name, setting_value')
          .in('setting_name', ['payment_text', 'payment_link', 'show_booking_section']);

        if (error) throw error;

        if (settings && settings.length > 0) {
          settings.forEach(setting => {
            switch (setting.setting_name) {
              case 'payment_text':
                setPaymentText(setting.setting_value as string);
                break;
              case 'payment_link':
                setPaymentLink(setting.setting_value as string);
                break;
              case 'show_booking_section':
                setShowBookingSection(setting.setting_value as boolean);
                break;
            }
          });
        }
      } catch (error) {
        console.error('Error loading payment settings:', error);
      }
    };

    loadPaymentSettings();
  }, []);

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

        {/* Payment and Booking Section */}
        {showBookingSection && (
          <div className="mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">{paymentText}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <BookingDialog>
                      <Button size="lg" className="bg-gray-800 text-white hover:bg-gray-700">
                        {t("services.bookMeeting")}
                      </Button>
                    </BookingDialog>
                    <Button size="lg" variant="outline" className="border-2 gap-2" onClick={() => window.open(paymentLink, '_blank')}>
                      <ExternalLink size={20} />
                      {t("services.paymentLink")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>;
};
export default ContactSection;