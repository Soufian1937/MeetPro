import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-calendar.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Planifiez vos{" "}
                <span className="hero-gradient bg-clip-text text-transparent">
                  rendez-vous
                </span>{" "}
                en toute simplicité
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Interface moderne et intuitive pour organiser vos réunions physiques et en ligne. 
                Connectez tous vos calendriers et automatisez vos rappels.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Commencer gratuitement
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Voir la démo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Calendriers multiples</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Disponibilité flexible</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Réunions collaboratives</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Intégrations avancées</span>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Interface de planification MeetSync" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full hero-gradient opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-accent/20 blur-xl animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;