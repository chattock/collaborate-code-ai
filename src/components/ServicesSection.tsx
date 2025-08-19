import { Check, ChevronDown, ExternalLink, Award, GraduationCap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingDialog } from "@/components/BookingDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";

const ServicesSection = () => {
  const { t } = useLanguage();
  const { showBookingSection } = useAdmin();
  const services = [{
    title: t("services.gis"),
    description: t("services.gisDesc")
  }, {
    title: t("services.dataAnalysis"),
    description: t("services.dataAnalysisDesc")
  }, {
    title: t("services.ml"),
    description: t("services.mlDesc")
  }, {
    title: t("services.webDev"),
    description: t("services.webDevDesc")
  }, {
    title: t("services.dataViz"),
    description: t("services.dataVizDesc")
  }, {
    title: t("services.webScraping"),
    description: t("services.webScrapingDesc")
  }, {
    title: t("services.database"),
    description: t("services.databaseDesc")
  }, {
    title: t("services.bigData"),
    description: t("services.bigDataDesc")
  }, {
    title: t("services.dataCleaning"),
    description: t("services.dataCleaningDesc")
  }];
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="services" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-lg text-muted-foreground mb-4">{t("services.explore")}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("services.title")}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Services List */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-center">{t("services.skills")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 h-96 overflow-y-auto pr-2">
                {services.map((service, index) => <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* About Me Widget */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-center">{t("services.aboutMe")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-6 h-96 overflow-y-auto pr-2 space-y-6">
                <div className="grid gap-6">
                  {/* Experience Card */}
                  <div className="text-center">
                    <Award className="w-6 h-6 mx-auto text-primary mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">{t("services.experience")}</h3>
                    <div className="text-sm text-muted-foreground text-left">
                      <ul className="space-y-1">
                        <li>{t("services.experienceDesc1")}</li>
                        <li>{t("services.experienceDesc2")}</li>
                        <li>{t("services.experienceDesc3")}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Education Card */}
                  <div className="text-center">
                    <GraduationCap className="w-6 h-6 mx-auto text-primary mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">{t("services.education")}</h3>
                    <div className="text-sm text-muted-foreground text-left">
                      <ul className="space-y-1">
                        <li>{t("services.educationDesc1")}</li>
                        <li>{t("services.educationDesc2")}</li>
                        <li>{t("services.educationDesc3")}</li>
                      </ul>
                    </div>
                  </div>

                  {/* About Me Section */}
                  <div className="text-center">
                    <User className="w-6 h-6 mx-auto text-primary mb-2" />
                    <h3 className="font-semibold text-foreground mb-3">{t("services.aboutMe")}</h3>
                    <div className="text-sm text-muted-foreground leading-relaxed text-left space-y-2">
                      <p>{t("services.aboutDesc1")}</p>
                      <p>{t("services.aboutDesc2")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment and Booking Section */}
        {showBookingSection && (
          <div className="mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">{t("services.paymentDesc")}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <BookingDialog>
                      <Button size="lg" className="bg-gray-800 text-white hover:bg-gray-700">
                        {t("services.bookMeeting")}
                      </Button>
                    </BookingDialog>
                    <Button size="lg" variant="outline" className="border-2 gap-2" onClick={() => window.open('https://buy.stripe.com/9AQ9Cv4mm2HgcEgcMM', '_blank')}>
                      <ExternalLink size={20} />
                      {t("services.paymentLink")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scroll Arrow */}
        <div className="flex justify-center mt-16">
          <Button variant="ghost" size="icon" onClick={scrollToContact} className="w-12 h-12 rounded-full hover:bg-primary/10">
            <ChevronDown size={24} className="text-primary" />
          </Button>
        </div>
      </div>
    </section>;
};
export default ServicesSection;