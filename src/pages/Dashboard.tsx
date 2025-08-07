import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  Video, 
  Settings,
  BarChart3,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

const Dashboard = () => {
  const { user } = useAuth();
  const events = [
    {
      id: 1,
      title: "Consultation Business",
      duration: "30 min",
      bookings: 12,
      status: "active",
      type: "video"
    },
    {
      id: 2,
      title: "Entretien d'embauche",
      duration: "45 min",
      bookings: 8,
      status: "active",
      type: "physical"
    },
    {
      id: 3,
      title: "Réunion équipe",
      duration: "60 min",
      bookings: 5,
      status: "draft",
      type: "video"
    }
  ];

  const recentBookings = [
    {
      id: 1,
      title: "Consultation Business",
      client: "Marie Dubois",
      date: "2024-08-08 14:30",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Entretien d'embauche",
      client: "Pierre Martin",
      date: "2024-08-09 10:00",
      status: "pending"
    },
    {
      id: 3,
      title: "Réunion équipe",
      client: "Équipe Marketing",
      date: "2024-08-10 16:00",
      status: "confirmed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue, {user?.user_metadata?.first_name || 'Utilisateur'} !
          </h1>
          <p className="text-muted-foreground">
            Gérez vos rendez-vous et réunions facilement
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">+12% ce mois</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Événements actifs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 nouveaux</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">+5% vs mois dernier</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients uniques</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">7 nouveaux</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Mes événements
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </Button>
              </CardTitle>
              <CardDescription>
                Gérez vos types d'événements et leurs paramètres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      {event.type === "video" ? (
                        <Video className="h-4 w-4 text-primary" />
                      ) : (
                        <Users className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.duration} • {event.bookings} réservations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={event.status === "active" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
              <CardDescription>
                Dernières réservations de vos clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <h4 className="font-medium">{booking.title}</h4>
                    <p className="text-sm text-muted-foreground">{booking.client}</p>
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;