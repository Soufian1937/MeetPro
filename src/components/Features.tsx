import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Video, 
  Palette, 
  Smartphone, 
  Infinity, 
  Link, 
  Zap, 
  RotateCcw, 
  Users, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Types d'événements personnalisés",
    description: "Créez des types d'événements illimités selon vos besoins spécifiques",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "Disponibilité flexible",
    description: "Personnalisez vos créneaux de disponibilité selon votre emploi du temps",
    color: "text-accent"
  },
  {
    icon: Video,
    title: "Vidéoconférence intégrée",
    description: "Ajoutez automatiquement des liens de vidéoconférence à vos réunions",
    color: "text-primary"
  },
  {
    icon: Palette,
    title: "Page de réservation personnalisée",
    description: "Créez une page de réservation à votre image avec votre branding",
    color: "text-accent"
  },
  {
    icon: Smartphone,
    title: "Multi-plateforme",
    description: "Accessible sur PC, tablette et smartphone avec une interface responsive",
    color: "text-primary"
  },
  {
    icon: Infinity,
    title: "Événements illimités",
    description: "Créez autant de types d'événements que nécessaire sans restriction",
    color: "text-accent"
  },
  {
    icon: Link,
    title: "Calendriers connectés",
    description: "Synchronisez plusieurs calendriers pour une vue unifiée",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Intégrations avancées",
    description: "Connectez avec n8n, Zapier et webhooks pour automatiser vos workflows",
    color: "text-accent"
  },
  {
    icon: RotateCcw,
    title: "Rappels automatiques",
    description: "Envoyez des rappels automatiques par email avant vos rendez-vous",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Réunions partagées",
    description: "Organisez des réunions Round Robin avec votre équipe",
    color: "text-accent"
  },
  {
    icon: Shield,
    title: "Administration avancée",
    description: "Fonctionnalités d'administrateur pour gérer tous les comptes",
    color: "text-primary"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Toutes les <span className="hero-gradient bg-clip-text text-transparent">fonctionnalités</span> dont vous avez besoin
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une solution complète pour gérer vos rendez-vous et réunions avec des fonctionnalités avancées
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-hover group cursor-pointer border-0 shadow-lg bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;