import { Check, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      title: "GIS Solutions",
      description: "Geospatial data Analysis with QGIS"
    },
    {
      title: "Data Analysis", 
      description: "Leveraging Python or R in Jupyter or RMarkdown for data driven insights"
    },
    {
      title: "Machine Learning",
      description: "Building predictive models with scikit-learn"
    },
    {
      title: "Web Development",
      description: "Creating and maintaining websites with HTML/CSS/JavaScript"
    },
    {
      title: "Data Visualization",
      description: "Creating insightful visuals with Python or R based visualization packages"
    },
    {
      title: "Web Scraping",
      description: "Extracting data from websites"
    },
    {
      title: "Database Management",
      description: "PostgreSQL for organizing and storing data"
    },
    {
      title: "API Integration",
      description: "Connecting software systems"
    },
    {
      title: "Big Data Processing", 
      description: "Handling large datasets with Spark SQL and TensorFlow"
    },
    {
      title: "Data Cleaning",
      description: "Improving data quality"
    }
  ];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
              <p className="text-center text-muted-foreground">
                All services are £20 per hour. Total hours can be confirmed after a consultation.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                {services.map((service, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 p-3">
                  <div>
                    <h3 className="font-semibold text-foreground">And more...</h3>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-2 gap-2"
                  onClick={() => window.open('https://buy.stripe.com/9AQ9Cv4mm2HgcEgcMM', '_blank')}
                >
                  <ExternalLink size={20} />
                  Payment Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Widget */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-center">Book a Free Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">Booking widget would be embedded here</p>
                  <p className="text-sm">Acuity Scheduling integration</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 gap-2"
                    onClick={() => window.open('https://app.acuityscheduling.com/schedule.php?owner=33781461', '_blank')}
                  >
                    <ExternalLink size={16} />
                    Book Consultation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scroll Arrow */}
        <div className="flex justify-center mt-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToContact}
            className="w-12 h-12 rounded-full hover:bg-primary/10"
          >
            <ChevronDown size={24} className="text-primary" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;