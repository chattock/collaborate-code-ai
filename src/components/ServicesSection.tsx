import { Check, ChevronDown, ExternalLink, Award, GraduationCap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingDialog } from "@/components/BookingDialog";

const ServicesSection = () => {
  const services = [{
    title: "GIS Solutions",
    description: "Geospatial data Analysis with Esri products"
  }, {
    title: "Data Analysis",
    description: "Leveraging Python or R in Jupyter or RMarkdown for data driven insights"
  }, {
    title: "Machine Learning",
    description: "Building predictive models with scikit-learn"
  }, {
    title: "Web Development",
    description: "Creating and maintaining websites with HTML/CSS/JavaScript"
  }, {
    title: "Data Visualization",
    description: "Creating insightful visuals with Python or R based visualization packages"
  }, {
    title: "Web Scraping",
    description: "Extracting data from websites"
  }, {
    title: "Database Management",
    description: "PostgreSQL for organizing and storing data"
  }, {
    title: "Big Data Processing",
    description: "Handling large datasets with Spark SQL and TensorFlow"
  }, {
    title: "Data Cleaning",
    description: "Improving data quality"
  }];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-lg text-muted-foreground mb-4">Explore My</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Services</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Services List */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-center">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 h-96 overflow-y-auto pr-2">
                {services.map((service, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* About Me Widget */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-center">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-6 h-96 overflow-y-auto pr-2 space-y-6">
                {/* About Me Section */}
                <div className="text-center">
                  <User className="w-6 h-6 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold text-foreground mb-3">About Me</h3>
                  <div className="text-sm text-muted-foreground leading-relaxed text-left space-y-2">
                    <ul className="space-y-1">
                      <li>• I have studied Geographic Data Science at the London School of Economics (LSE), where I built a strong technical foundation in data analysis and geographic information systems</li>
                      <li>• With a bachelor's degree in Chinese Language and Business at LSE, I have worked on a range of projects leveraging Python, R, QGIS and ArcGIS to analyse datasets, visualise spatial patterns, and develop models tailored to geographic data challenges</li>
                      <li>• Professionally, I have developed expertise in GIS, data science, ESG reporting, and venture capital</li>
                      <li>• In addition to my academic and professional experience, I earned the IBM Data Science Professional Certificate independently</li>
                    </ul>
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* Experience Card */}
                  <div className="text-center">
                    <Award className="w-6 h-6 mx-auto text-primary mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">Experience</h3>
                    <div className="text-sm text-muted-foreground text-left">
                      <ul className="space-y-1">
                        <li>• GIS Consultant at ESRI</li>
                        <li>• 3+ years experience in Python, R, SQL, JavaScript and GIS technologies</li>
                      </ul>
                    </div>
                  </div>

                  {/* Education Card */}
                  <div className="text-center">
                    <GraduationCap className="w-6 h-6 mx-auto text-primary mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">Education</h3>
                    <div className="text-sm text-muted-foreground text-left">
                      <ul className="space-y-1">
                        <li>• M.Sc. Geographic Data Science - London School of Economics</li>
                        <li>• IBM Data Science Professional Certificate</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment and Booking Section */}
        <div className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Meetings are Free. Payments for any services can be made here. All services are £20 per hour.</p>
                <div className="flex gap-4 justify-center">
                  <BookingDialog>
                    <Button size="lg" className="bg-gray-800 text-white hover:bg-gray-700">
                      Book a Meeting
                    </Button>
                  </BookingDialog>
                  <Button size="lg" variant="outline" className="border-2 gap-2" onClick={() => window.open('https://buy.stripe.com/9AQ9Cv4mm2HgcEgcMM', '_blank')}>
                    <ExternalLink size={20} />
                    Payment Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scroll Arrow */}
        <div className="flex justify-center mt-16">
          <Button variant="ghost" size="icon" onClick={scrollToContact} className="w-12 h-12 rounded-full hover:bg-primary/10">
            <ChevronDown size={24} className="text-primary" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;