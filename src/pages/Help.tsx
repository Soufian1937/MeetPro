import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, Calendar, Users, Settings, Video, Phone, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqData = [
  {
    id: "getting-started",
    question: "Comment commencer avec MeetSync ?",
    answer: "Pour commencer avec MeetSync, créez d'abord votre compte gratuit. Ensuite, configurez votre premier type d'événement en définissant la durée, le type de rendez-vous (visioconférence, en personne, ou téléphone) et vos disponibilités. Partagez ensuite le lien de réservation avec vos clients."
  },
  {
    id: "create-event",
    question: "Comment créer un type d'événement ?",
    answer: "Dans votre dashboard, cliquez sur 'Créer un Événement'. Remplissez les informations : titre, description, durée, prix (optionnel), type de lieu (visioconférence, physique, téléphone) et les détails du lieu. Votre événement sera automatiquement actif et prêt à recevoir des réservations."
  },
  {
    id: "booking-management",
    question: "Comment gérer mes réservations ?",
    answer: "Toutes vos réservations apparaissent dans l'onglet 'Réservations' de chaque événement. Vous pouvez voir les détails des clients, confirmer ou annuler des rendez-vous, et suivre le statut de chaque réservation (en attente, confirmée, annulée, terminée)."
  },
  {
    id: "video-meetings",
    question: "Comment fonctionnent les visioconférences ?",
    answer: "Pour les événements en visioconférence, ajoutez votre lien de réunion (Zoom, Google Meet, Teams, etc.) dans les détails du lieu. Ce lien sera automatiquement partagé avec vos clients lors de la confirmation de leur réservation."
  },
  {
    id: "pricing",
    question: "Puis-je facturer mes rendez-vous ?",
    answer: "Oui, vous pouvez définir un prix pour chaque type d'événement. Le prix sera affiché aux clients lors de la réservation. Actuellement, MeetSync affiche les prix à titre informatif - l'intégration de paiement sera disponible prochainement."
  },
  {
    id: "availability",
    question: "Comment définir mes disponibilités ?",
    answer: "Actuellement, les créneaux sont générés automatiquement de 9h à 18h. Une fonctionnalité avancée de gestion des disponibilités personnalisées sera bientôt disponible pour vous permettre de définir vos horaires précis."
  },
  {
    id: "notifications",
    question: "Comment recevoir les notifications de réservation ?",
    answer: "Vous recevez automatiquement un email à chaque nouvelle réservation. Les clients reçoivent également une confirmation par email avec tous les détails du rendez-vous."
  },
  {
    id: "cancel-reschedule",
    question: "Comment annuler ou reprogrammer un rendez-vous ?",
    answer: "Dans votre dashboard, accédez à l'onglet 'Réservations' de l'événement concerné. Vous pouvez modifier le statut de la réservation ou la supprimer. Pour reprogrammer, contactez directement votre client avec les informations fournies."
  }
];

const categories = [
  {
    icon: Calendar,
    title: "Gestion des événements",
    description: "Créer et configurer vos types de rendez-vous",
    color: "text-blue-600"
  },
  {
    icon: Users,
    title: "Réservations clients",
    description: "Gérer les demandes et confirmations",
    color: "text-green-600"
  },
  {
    icon: Video,
    title: "Visioconférences",
    description: "Configurer les réunions en ligne",
    color: "text-purple-600"
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Personnaliser votre compte et préférences",
    color: "text-orange-600"
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaq = faqData.filter(
    item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-background via-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Centre d'<span className="hero-gradient bg-clip-text text-transparent">aide</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur MeetSync
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category, index) => (
              <Card key={index} className="card-hover cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
            
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaq.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {filteredFaq.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      Aucun résultat trouvé pour "{searchTerm}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div className="max-w-2xl mx-auto mt-16">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Besoin d'aide supplémentaire ?</CardTitle>
                <CardDescription>
                  Notre équipe support est là pour vous aider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Nous contacter
                  </a>
                  <a 
                    href="/documentation" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Documentation
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}