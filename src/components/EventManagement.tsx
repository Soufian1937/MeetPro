import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Settings, 
  BarChart3,
  Calendar,
  Clock,
  Video,
  Users,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Database } from '@/integrations/supabase/types';

type EventType = Database['public']['Tables']['events']['Row'];
type LocationType = Database['public']['Enums']['location_type'];

interface EventManagementProps {
  event: EventType;
  onEdit?: (event: EventType) => void;
  onDelete?: (eventId: string) => void;
}

const EventManagement = ({ event, onEdit, onDelete }: EventManagementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: event.title,
    description: event.description || '',
    duration: event.duration,
    price: event.price || 0,
    location_type: event.location_type,
    location_details: event.location_details || '',
    is_active: event.is_active
  });
  const { updateEvent, deleteEvent, bookings } = useEvents();

  const eventBookings = bookings.filter(b => b.event_type_id === event.id);
  const confirmedBookings = eventBookings.filter(b => b.status === 'confirmed');
  const pendingBookings = eventBookings.filter(b => b.status === 'pending');

  const getLocationIcon = (type: LocationType) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'physical':
        return <Users className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getLocationLabel = (type: LocationType) => {
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

  const handleSave = async () => {
    const result = await updateEvent(event.id, editData);
    if (result) {
      setIsEditing(false);
      onEdit?.(result);
    }
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      const success = await deleteEvent(event.id);
      if (success) {
        onDelete?.(event.id);
      }
    }
  };

  const copyBookingLink = () => {
    const link = `${window.location.origin}/book/${event.id}`;
    navigator.clipboard.writeText(link);
  };

  const toggleStatus = async () => {
    await updateEvent(event.id, { is_active: !event.is_active });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold"
              />
            ) : (
              <CardTitle className="flex items-center space-x-2">
                <span>{event.title}</span>
                {!event.is_active && <EyeOff className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{event.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                {getLocationIcon(event.location_type)}
                <span>{getLocationLabel(event.location_type)}</span>
              </div>
              {event.price && event.price > 0 && (
                <Badge variant="secondary">{event.price}€</Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={event.is_active ? "default" : "secondary"}>
              {event.is_active ? "Actif" : "Inactif"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleStatus}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {event.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de l'événement..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Durée (minutes)</Label>
                    <Input
                      type="number"
                      value={editData.duration}
                      onChange={(e) => setEditData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                      min="15"
                      step="15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prix (€)</Label>
                    <Input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleSave} size="sm">Sauvegarder</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {event.description && (
                  <p className="text-muted-foreground">{event.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyBookingLink}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copier le lien</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/book/${event.id}`, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Aperçu</span>
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Événement actif</Label>
                  <p className="text-sm text-muted-foreground">
                    Les clients peuvent réserver cet événement
                  </p>
                </div>
                <Switch
                  checked={event.is_active}
                  onCheckedChange={toggleStatus}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Type de lieu</Label>
                <Select
                  value={editData.location_type}
                  onValueChange={(value: LocationType) => 
                    setEditData(prev => ({ ...prev, location_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>Visioconférence</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="physical">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>En personne</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Téléphone</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Détails du lieu</Label>
                <Input
                  value={editData.location_details}
                  onChange={(e) => setEditData(prev => ({ ...prev, location_details: e.target.value }))}
                  placeholder={
                    editData.location_type === 'video' ? 'Lien Zoom, Google Meet...' :
                    editData.location_type === 'physical' ? 'Adresse du rendez-vous' :
                    'Numéro de téléphone'
                  }
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{eventBookings.length}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
                  <div className="text-sm text-muted-foreground">Confirmées</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{pendingBookings.length}</div>
                  <div className="text-sm text-muted-foreground">En attente</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              {eventBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{booking.client_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(booking.scheduled_at), 'PPP à HH:mm', { locale: fr })}
                    </div>
                  </div>
                  <Badge variant={
                    booking.status === 'confirmed' ? 'default' :
                    booking.status === 'pending' ? 'secondary' :
                    booking.status === 'cancelled' ? 'destructive' : 'outline'
                  }>
                    {booking.status === 'confirmed' && 'Confirmé'}
                    {booking.status === 'pending' && 'En attente'}
                    {booking.status === 'cancelled' && 'Annulé'}
                    {booking.status === 'completed' && 'Terminé'}
                  </Badge>
                </div>
              ))}
              
              {eventBookings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune réservation pour le moment</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="font-medium">Taux de conversion</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {eventBookings.length > 0 
                      ? Math.round((confirmedBookings.length / eventBookings.length) * 100)
                      : 0
                    }%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {confirmedBookings.length}/{eventBookings.length} confirmées
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Revenus estimés</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {((event.price || 0) * confirmedBookings.length).toFixed(2)}€
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ce mois-ci
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {eventBookings
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 3)
                    .map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between text-sm">
                        <span>Nouvelle réservation de {booking.client_name}</span>
                        <span className="text-muted-foreground">
                          {format(new Date(booking.created_at), 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                    ))
                  }
                  
                  {eventBookings.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Aucune activité récente
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EventManagement;