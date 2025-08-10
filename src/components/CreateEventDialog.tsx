import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Video, Users, Phone } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import type { Database } from '@/integrations/supabase/types';

type LocationType = Database['public']['Enums']['location_type'];

interface CreateEventDialogProps {
  children?: React.ReactNode;
}

export default function CreateEventDialog({ children }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    price: 0,
    location_type: 'video' as LocationType,
    location_details: '',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createEvent(formData);
      if (result) {
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          duration: 30,
          price: 0,
          location_type: 'video',
          location_details: '',
          is_active: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Créer un événement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer un nouvel événement</DialogTitle>
            <DialogDescription>
              Configurez votre type d'événement pour permettre aux clients de réserver des créneaux.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'événement *</Label>
              <Input
                id="title"
                placeholder="Ex: Consultation Business"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre événement..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_type">Type de rendez-vous *</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value: LocationType) => setFormData(prev => ({ ...prev, location_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getLocationIcon(formData.location_type)}
                      <span>
                        {formData.location_type === 'video' && 'Visioconférence'}
                        {formData.location_type === 'physical' && 'En personne'}
                        {formData.location_type === 'phone' && 'Téléphone'}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Visioconférence
                    </div>
                  </SelectItem>
                  <SelectItem value="physical">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      En personne
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_details">Détails du lieu</Label>
              <Input
                id="location_details"
                placeholder={
                  formData.location_type === 'video' ? 'Lien Zoom, Google Meet...' :
                  formData.location_type === 'physical' ? 'Adresse du rendez-vous' :
                  'Numéro de téléphone'
                }
                value={formData.location_details}
                onChange={(e) => setFormData(prev => ({ ...prev, location_details: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Événement actif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? "Création..." : "Créer l'événement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}