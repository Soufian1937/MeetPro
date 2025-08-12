import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    description: "Parfait pour commencer",
    icon: Star,
    color: "text-gray-500",
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-200",
    features: [
      "1 type d'événement",
      "10 réservations/mois",
      "Calendrier de base",
      "Support email",
      "Intégration calendrier simple"
    ],
    limitations: [
      "Branding MeetSync",
      "Fonctionnalités limitées"
    ],
    popular: false,
    cta: "Commencer gratuitement"
  },
  {
    name: "Pro",
    price: "5€",
    period: "/mois",
    description: "Pour les professionnels",
    icon: Zap,
    color: "text-primary",
    bgGradient: "from-primary/5 to-primary/10",
    borderColor: "border-primary/20",
    features: [
      "Types d'événements illimités",
      "Réservations illimitées",
      "Calendriers multiples",
      "Personnalisation avancée",
      "Rappels automatiques",
      "Intégrations Zoom/Meet",
      "Analytics détaillés",
      "Support prioritaire"
    ],
    limitations: [],
    popular: true,
    cta: "Choisir Pro"
  },
  {
    name: "Business",
    price: "10€",
    period: "/mois",
    description: "Pour les équipes",
    icon: Crown,
    color: "text-accent",
    bgGradient: "from-accent/5 to-accent/10",
    borderColor: "border-accent/20",
    features: [
      "Tout du plan Pro",
      "Équipe collaborative",
      "Round Robin meetings",
      "API complète",
      "Webhooks avancés",
      "Intégrations n8n/Zapier",
      "White-label complet",
      "Support dédié 24/7",
      "Formation personnalisée"
    ],
    limitations: [],
    popular: false,
    cta: "Choisir Business"
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-background via-secondary/30 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Choisissez votre <span className="hero-gradient bg-clip-text text-transparent">plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Des tarifs transparents qui s'adaptent à vos besoins, de l'entrepreneur solo aux grandes équipes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`
                relative card-hover group cursor-pointer border-2 transition-all duration-500
                ${plan.popular ? 'scale-105 shadow-2xl border-primary glow-effect' : plan.borderColor}
                bg-gradient-to-br ${plan.bgGradient}
                hover:scale-110 hover:rotate-1 transform-gpu
                before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r 
                before:from-transparent before:via-white/10 before:to-transparent 
                before:translate-x-[-100%] hover:before:translate-x-[100%] 
                before:transition-transform before:duration-1000 before:ease-out
                overflow-hidden
              `}
              style={{
                animationDelay: `${index * 0.2}s`,
                transform: `perspective(1000px) rotateY(${index === 1 ? 0 : index === 0 ? '5deg' : '-5deg'})`
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                    ⭐ Plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4 relative z-10">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <plan.icon className={`h-8 w-8 ${plan.color}`} />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <Button 
                  className={`w-full ${plan.popular ? 'variant-hero' : ''} group-hover:scale-105 transition-transform`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate('/auth')}
                >
                  {plan.cta}
                </Button>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Fonctionnalités incluses
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-2 border-t">
                      <h5 className="font-medium text-xs text-muted-foreground mb-2">Limitations :</h5>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-xs text-muted-foreground">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
              
              {/* Effet de brillance 3D */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            Tous les plans incluent une garantie de remboursement de 30 jours
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Annulation à tout moment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Support français</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;