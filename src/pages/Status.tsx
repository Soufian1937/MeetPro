import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  Activity
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  description: string;
  icon: any;
  uptime: string;
  responseTime: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  updates: {
    time: string;
    message: string;
    status: string;
  }[];
}

const services: ServiceStatus[] = [
  {
    name: "API MeetSync",
    status: "operational",
    description: "API principale pour les réservations et événements",
    icon: Server,
    uptime: "99.98%",
    responseTime: "145ms"
  },
  {
    name: "Base de données",
    status: "operational", 
    description: "Stockage des données utilisateurs et réservations",
    icon: Database,
    uptime: "99.99%",
    responseTime: "12ms"
  },
  {
    name: "Interface web",
    status: "operational",
    description: "Dashboard et pages de réservation",
    icon: Globe,
    uptime: "99.95%",
    responseTime: "89ms"
  },
  {
    name: "Authentification",
    status: "operational",
    description: "Système de connexion et sécurité",
    icon: Shield,
    uptime: "99.97%",
    responseTime: "67ms"
  },
  {
    name: "Notifications email",
    status: "operational",
    description: "Envoi des confirmations et rappels",
    icon: Zap,
    uptime: "99.92%",
    responseTime: "234ms"
  }
];

const recentIncidents: Incident[] = [
  {
    id: "inc-001",
    title: "Ralentissement des notifications email",
    status: "resolved",
    severity: "low",
    description: "Délai légèrement augmenté pour l'envoi des emails de confirmation",
    timestamp: "2025-01-06 14:30",
    updates: [
      {
        time: "2025-01-06 15:45",
        message: "Le problème a été identifié et résolu. Les emails sont maintenant envoyés normalement.",
        status: "resolved"
      },
      {
        time: "2025-01-06 14:30",
        message: "Nous enquêtons sur un ralentissement dans l'envoi des notifications email.",
        status: "investigating"
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational':
      return 'text-green-600';
    case 'degraded':
      return 'text-yellow-600';
    case 'outage':
      return 'text-red-600';
    case 'maintenance':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'degraded':
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    case 'outage':
      return <XCircle className="h-5 w-5 text-red-600" />;
    case 'maintenance':
      return <Clock className="h-5 w-5 text-blue-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'operational':
      return 'Opérationnel';
    case 'degraded':
      return 'Dégradé';
    case 'outage':
      return 'Panne';
    case 'maintenance':
      return 'Maintenance';
    default:
      return 'Inconnu';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Status() {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    setLastUpdate(new Date().toLocaleString('fr-FR'));
  }, []);

  const allOperational = services.every(service => service.status === 'operational');
  const overallUptime = services.reduce((acc, service) => acc + parseFloat(service.uptime), 0) / services.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-background via-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Statut de la <span className="hero-gradient bg-clip-text text-transparent">plateforme</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Surveillance en temps réel de tous nos services MeetSync
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Overall Status */}
            <Card className={`border-2 ${allOperational ? 'border-green-200 bg-green-50/50' : 'border-yellow-200 bg-yellow-50/50'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {allOperational ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-yellow-600" />
                    )}
                    <div>
                      <CardTitle className={allOperational ? 'text-green-800' : 'text-yellow-800'}>
                        {allOperational ? 'Tous les systèmes opérationnels' : 'Problèmes détectés'}
                      </CardTitle>
                      <CardDescription className={allOperational ? 'text-green-600' : 'text-yellow-600'}>
                        Disponibilité globale: {overallUptime.toFixed(2)}%
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Dernière mise à jour</p>
                    <p className="font-medium">{lastUpdate}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Services Status */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">État des services</h2>
              <div className="grid gap-4">
                {services.map((service, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            <service.icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground">Disponibilité</p>
                            <p className="font-semibold">{service.uptime}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Temps de réponse</p>
                            <p className="font-semibold">{service.responseTime}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(service.status)}
                            <span className={`font-medium ${getStatusColor(service.status)}`}>
                              {getStatusLabel(service.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Incidents récents</h2>
              {recentIncidents.length > 0 ? (
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <Card key={incident.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{incident.title}</CardTitle>
                              <Badge className={getSeverityColor(incident.severity)}>
                                {incident.severity.toUpperCase()}
                              </Badge>
                              <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                                {incident.status === 'resolved' ? 'Résolu' : 'En cours'}
                              </Badge>
                            </div>
                            <CardDescription>{incident.description}</CardDescription>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {incident.timestamp}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <h4 className="font-medium">Mises à jour</h4>
                          {incident.updates.map((update, updateIndex) => (
                            <div key={updateIndex} className="flex gap-3 p-3 bg-muted rounded-lg">
                              <div className="text-sm text-muted-foreground min-w-[80px]">
                                {update.time.split(' ')[1]}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{update.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun incident récent</h3>
                    <p className="text-muted-foreground">
                      Tous nos services fonctionnent normalement
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Historical Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance historique (30 derniers jours)</CardTitle>
                <CardDescription>
                  Disponibilité moyenne de nos services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.97%</div>
                    <p className="text-sm text-muted-foreground">Disponibilité globale</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">127ms</div>
                    <p className="text-sm text-muted-foreground">Temps de réponse moyen</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                    <p className="text-sm text-muted-foreground">Incidents critiques</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscribe to Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Restez informé</CardTitle>
                <CardDescription>
                  Recevez des notifications en cas d'incident ou de maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    S'abonner aux notifications
                  </a>
                  <p className="text-sm text-muted-foreground flex items-center">
                    Ou suivez-nous sur nos réseaux sociaux pour les mises à jour en temps réel
                  </p>
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