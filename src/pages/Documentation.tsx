import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Settings, 
  Video, 
  Phone, 
  MapPin,
  Clock,
  Mail,
  Link,
  Shield,
  Zap
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/events",
    description: "Récupérer tous les événements de l'utilisateur",
    auth: true
  },
  {
    method: "POST",
    endpoint: "/api/events",
    description: "Créer un nouveau type d'événement",
    auth: true
  },
  {
    method: "GET",
    endpoint: "/api/bookings",
    description: "Récupérer toutes les réservations",
    auth: true
  },
  {
    method: "POST",
    endpoint: "/api/bookings",
    description: "Créer une nouvelle réservation",
    auth: false
  }
];

const features = [
  {
    icon: Calendar,
    title: "Gestion d'événements",
    description: "Créez des types d'événements personnalisés avec durée, prix et localisation",
    items: [
      "Types d'événements illimités",
      "Configuration flexible de la durée",
      "Prix personnalisables",
      "Activation/désactivation rapide"
    ]
  },
  {
    icon: Video,
    title: "Modes de rendez-vous",
    description: "Supportez différents types de rendez-vous selon vos besoins",
    items: [
      "Visioconférence (Zoom, Meet, Teams)",
      "Rendez-vous physiques",
      "Appels téléphoniques",
      "Détails de localisation personnalisés"
    ]
  },
  {
    icon: Users,
    title: "Gestion des réservations",
    description: "Suivez et gérez toutes vos réservations en temps réel",
    items: [
      "Statuts de réservation (en attente, confirmé, annulé)",
      "Informations clients complètes",
      "Notes et commentaires",
      "Historique des réservations"
    ]
  },
  {
    icon: Shield,
    title: "Sécurité et confidentialité",
    description: "Vos données et celles de vos clients sont protégées",
    items: [
      "Authentification sécurisée",
      "Données chiffrées",
      "Accès contrôlé par utilisateur",
      "Conformité RGPD"
    ]
  }
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-background via-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="hero-gradient bg-clip-text text-transparent">Documentation</span> MeetSync
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Guide complet pour utiliser MeetSync et optimiser votre gestion de rendez-vous
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="guide" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="guide">Guide d'utilisation</TabsTrigger>
                <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="integration">Intégrations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="guide" className="space-y-8">
                <div className="grid gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        1. Créer votre premier événement
                      </CardTitle>
                      <CardDescription>
                        Configurez votre premier type de rendez-vous en quelques étapes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <h4 className="font-medium">Accédez à votre Dashboard</h4>
                            <p className="text-sm text-muted-foreground">Connectez-vous et cliquez sur "Créer un Événement"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <h4 className="font-medium">Configurez les détails</h4>
                            <p className="text-sm text-muted-foreground">Titre, description, durée et prix de votre événement</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <h4 className="font-medium">Choisissez le type de rendez-vous</h4>
                            <p className="text-sm text-muted-foreground">Visioconférence, en personne ou téléphone</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <h4 className="font-medium">Partagez votre lien</h4>
                            <p className="text-sm text-muted-foreground">Copiez le lien de réservation et partagez-le avec vos clients</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        2. Gérer vos réservations
                      </CardTitle>
                      <CardDescription>
                        Suivez et organisez toutes vos réservations clients
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Badge variant="secondary">En attente</Badge>
                            Nouvelles réservations
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Les clients peuvent réserver automatiquement. Confirmez ou modifiez selon vos besoins.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Badge variant="default">Confirmé</Badge>
                            Rendez-vous validés
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Les clients reçoivent automatiquement les détails de connexion par email.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-orange-600" />
                        3. Personnaliser vos paramètres
                      </CardTitle>
                      <CardDescription>
                        Adaptez MeetSync à votre façon de travailler
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium">Disponibilités</h4>
                          <p className="text-sm text-muted-foreground">Définissez vos horaires de travail</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium">Notifications</h4>
                          <p className="text-sm text-muted-foreground">Configurez vos alertes email</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Link className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <h4 className="font-medium">Intégrations</h4>
                          <p className="text-sm text-muted-foreground">Connectez vos outils favoris</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <feature.icon className="h-5 w-5 text-primary" />
                          {feature.title}
                        </CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>API REST MeetSync</CardTitle>
                    <CardDescription>
                      Intégrez MeetSync dans vos applications avec notre API REST
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Base URL</h4>
                        <code className="text-sm">https://api.meetsync.com/v1</code>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Endpoints disponibles</h4>
                        {apiEndpoints.map((endpoint, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm">{endpoint.endpoint}</code>
                            </div>
                            <div className="flex items-center gap-2">
                              {endpoint.auth && (
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Auth
                                </Badge>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {endpoint.description}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integration" className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-blue-600" />
                        Zoom
                      </CardTitle>
                      <CardDescription>Intégration native avec Zoom</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Créez automatiquement des réunions Zoom pour vos rendez-vous.
                      </p>
                      <Badge variant="outline">Bientôt disponible</Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        Google Calendar
                      </CardTitle>
                      <CardDescription>Synchronisation bidirectionnelle</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Synchronisez vos événements avec Google Calendar.
                      </p>
                      <Badge variant="outline">Bientôt disponible</Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-600" />
                        Zapier
                      </CardTitle>
                      <CardDescription>Automatisez vos workflows</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connectez MeetSync à plus de 5000 applications.
                      </p>
                      <Badge variant="outline">Bientôt disponible</Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>
                      Recevez des notifications en temps réel pour les événements importants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Événements disponibles</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• booking.created</li>
                            <li>• booking.confirmed</li>
                            <li>• booking.cancelled</li>
                            <li>• event.created</li>
                            <li>• event.updated</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Configuration</h4>
                          <p className="text-sm text-muted-foreground">
                            Configurez vos webhooks dans les paramètres de votre compte pour recevoir 
                            des notifications HTTP POST en temps réel.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}