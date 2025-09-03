import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PricingUpgradeProps {
  currentPlan?: 'free' | 'pro' | 'business';
  eventsCount?: number;
  maxEvents?: number;
}

const PricingUpgrade = ({ 
  currentPlan = 'free', 
  eventsCount = 0, 
  maxEvents = 10 
}: PricingUpgradeProps) => {
  const navigate = useNavigate();

  // Ne pas afficher si l'utilisateur est déjà sur un plan payant
  if (currentPlan !== 'free') {
    return null;
  }

  const isNearLimit = eventsCount >= maxEvents * 0.8; // 80% de la limite
  const isAtLimit = eventsCount >= maxEvents;

  return (
    <Card className={`border-2 ${isAtLimit ? 'border-orange-200 bg-orange-50/50' : 'border-primary/20 bg-primary/5'} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full -translate-y-16 translate-x-16" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isAtLimit ? 'Limite atteinte !' : 'Passez au niveau supérieur'}
              </CardTitle>
              <CardDescription>
                {isAtLimit 
                  ? `Vous avez atteint la limite de ${maxEvents} événements du plan gratuit`
                  : `${eventsCount}/${maxEvents} événements utilisés`
                }
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Plan Gratuit
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        {isNearLimit && (
          <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 font-medium">
              ⚠️ Vous approchez de la limite de votre plan gratuit
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Plan Pro - 2€/mois
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Événements illimités
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Personnalisation avancée
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Rappels automatiques
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Analytics détaillés
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Crown className="h-4 w-4 text-accent" />
              Plan Business - 5€/mois
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Tout du plan Pro
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Équipe collaborative
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                API complète
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                White-label complet
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={() => navigate('/#pricing')} 
            className="flex-1 group"
            variant="hero"
          >
            <Star className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
            Voir tous les plans
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {isAtLimit && (
            <Button 
              onClick={() => navigate('/#pricing')} 
              variant="outline"
              className="flex-1"
            >
              Débloquer maintenant
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingUpgrade;