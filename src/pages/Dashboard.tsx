import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  Video, 
  Settings,
  BarChart3,
  Bell,
  Phone,
  Trash2,
  Edit
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import Header from "@/components/Header";
import CreateEventDialog from "@/components/CreateEventDialog";
import EventManagement from "@/components/EventManagement";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
  const { user } = useAuth();
  const { events, bookings, loading, deleteEvent, updateEvent } = useEvents();

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-primary" />;
      case 'physical':
        return <Users className="h-4 w-4 text-primary" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-primary" />;
      default:
        return <Video className="h-4 w-4 text-primary" />;
    }
  };

  const getLocationLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Visioconférence';
      case 'physical':
        return 'En personne';
      case 'phone':
        return 'Téléphone';
      default:
        return 'Visioconférence';
    }
  };

  const getBookingCount = (eventId: string) => {
    return bookings.filter(booking => booking.event_type_id === eventId).length;
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      await deleteEvent(eventId);
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: boolean) => {
    await updateEvent(eventId, { is_active: !currentStatus });
  };

  // Calculs des statistiques
  const totalBookings = bookings.length;
  const activeEvents = events.filter(e => e.is_active).length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const conversionRate = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;
  const uniqueClients = new Set(bookings.map(b => b.client_email)).size;

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
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {totalBookings > 0 ? `${confirmedBookings} confirmées` : 'Aucune réservation'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Événements actifs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEvents}</div>
              <p className="text-xs text-muted-foreground">
                {events.length - activeEvents} inactifs
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {confirmedBookings}/{totalBookings} confirmées
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients uniques</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueClients}</div>
              <p className="text-xs text-muted-foreground">
                {uniqueClients > 0 ? 'clients différents' : 'Aucun client'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Mes événements
                <CreateEventDialog>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer
                  </Button>
                </CreateEventDialog>
              </CardTitle>
              <CardDescription>
                Gérez vos types d'événements et leurs paramètres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                // Skeleton loading
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun événement</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez votre premier type d'événement pour commencer à recevoir des réservations.
                  </p>
                  <CreateEventDialog>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer mon premier événement
                    </Button>
                  </CreateEventDialog>
                </div>
              ) : (
                <div className="space-y-6">
                  {events.map((event) => (
                    <EventManagement
                      key={event.id}
                      event={event}
                      onEdit={(updatedEvent) => {
                        // L'événement sera automatiquement mis à jour via le hook useEvents
                      }}
                      onDelete={(eventId) => {
                        // L'événement sera automatiquement supprimé via le hook useEvents
                      }}
                    />
                  ))}
                </div>
                ))
              )}
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
              {loading ? (
                // Skeleton loading
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune réservation</h3>
                  <p className="text-muted-foreground">
                    Les réservations de vos clients apparaîtront ici.
                  </p>
                </div>
              ) : (
                bookings.slice(0, 5).map((booking) => {
                  const eventType = events.find(e => e.id === booking.event_type_id);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div>
                        <h4 className="font-medium">{eventType?.title || 'Événement supprimé'}</h4>
                        <p className="text-sm text-muted-foreground">{booking.client_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(booking.scheduled_at), 'PPP à HH:mm', { locale: fr })}
                        </p>
                      </div>
                      <Badge variant={
                        booking.status === "confirmed" ? "default" : 
                        booking.status === "pending" ? "secondary" :
                        booking.status === "cancelled" ? "destructive" : "outline"
                      }>
                        {booking.status === "confirmed" && "Confirmé"}
                        {booking.status === "pending" && "En attente"}
                        {booking.status === "cancelled" && "Annulé"}
                        {booking.status === "completed" && "Terminé"}
                      </Badge>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;