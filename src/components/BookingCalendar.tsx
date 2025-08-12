import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, Video, Users, Phone, Calendar as CalendarIcon, User, Mail, MessageSquare } from 'lucide-react';
import { format, addDays, setHours, setMinutes, isAfter, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type EventType = Database['public']['Tables']['event_types']['Row'];

interface BookingCalendarProps {
  eventType: EventType;
}

const BookingCalendar = ({ eventType }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'confirmation'>('date');
  const { toast } = useToast();

  // Générer les créneaux disponibles pour une date donnée
  const generateTimeSlots = (date: Date) => {
    const slots: string[] = [];
    const startHour = 9; // 9h
    const endHour = 18; // 18h
    const duration = eventType.duration;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        if (hour * 60 + minute + duration <= endHour * 60) {
          const timeSlot = setMinutes(setHours(date, hour), minute);
          if (isAfter(timeSlot, new Date())) {
            slots.push(format(timeSlot, 'HH:mm'));
          }
        }
      }
    }
    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableSlots(slots);
    }
  }, [selectedDate, eventType.duration]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isAfter(date, startOfDay(new Date()))) {
      setSelectedDate(date);
      setSelectedTime('');
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

      const { error } = await supabase
        .from('bookings')
        .insert({
          event_type_id: eventType.id,
          client_name: bookingData.clientName,
          client_email: bookingData.clientEmail,
          client_phone: bookingData.clientPhone || null,
          notes: bookingData.notes || null,
          scheduled_at: scheduledAt.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      setStep('confirmation');
      toast({
        title: "Réservation confirmée !",
        description: "Vous recevrez un email de confirmation sous peu.",
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la réservation. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationIcon = () => {
    switch (eventType.location_type) {
      case 'video':
        return <Video className="h-5 w-5 text-primary" />;
      case 'physical':
        return <Users className="h-5 w-5 text-primary" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-primary" />;
      default:
        return <Video className="h-5 w-5 text-primary" />;
    }
  };

  const getLocationLabel = () => {
    switch (eventType.location_type) {
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

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center border-2 border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Réservation confirmée !</CardTitle>
            <CardDescription className="text-green-600">
              Votre rendez-vous a été programmé avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">{eventType.title}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(selectedDate!, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedTime} ({eventType.duration} minutes)</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {getLocationIcon()}
                  <span>{getLocationLabel()}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Un email de confirmation a été envoyé à <strong>{bookingData.clientEmail}</strong>
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Programmer un autre rendez-vous
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{eventType.title}</h1>
        {eventType.description && (
          <p className="text-muted-foreground mb-4">{eventType.description}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{eventType.duration} minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            {getLocationIcon()}
            <span>{getLocationLabel()}</span>
          </div>
          {eventType.price && eventType.price > 0 && (
            <Badge variant="secondary" className="font-semibold">
              {eventType.price}€
            </Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Étape 1: Sélection de la date */}
        <Card className={`transition-all duration-300 ${step === 'date' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>1. Choisissez une date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => 
                isBefore(date, startOfDay(new Date())) || 
                isAfter(date, addDays(new Date(), 60))
              }
              className="rounded-md border"
              locale={fr}
            />
          </CardContent>
        </Card>

        {/* Étape 2: Sélection de l'heure */}
        <Card className={`transition-all duration-300 ${step === 'time' ? 'ring-2 ring-primary' : step === 'date' ? 'opacity-50' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>2. Choisissez un horaire</span>
            </CardTitle>
            {selectedDate && (
              <CardDescription>
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(slot)}
                    className="text-sm"
                  >
                    {slot}
                  </Button>
                ))}
                {availableSlots.length === 0 && (
                  <p className="col-span-3 text-center text-muted-foreground py-4">
                    Aucun créneau disponible pour cette date
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Sélectionnez d'abord une date
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Étape 3: Informations personnelles */}
      {step === 'details' && (
        <Card className="mt-8 ring-2 ring-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>3. Vos informations</span>
            </CardTitle>
            <CardDescription>
              Rendez-vous le {format(selectedDate!, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nom complet *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="clientName"
                      placeholder="Votre nom complet"
                      value={bookingData.clientName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="votre@email.com"
                      value={bookingData.clientEmail}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Téléphone (optionnel)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clientPhone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={bookingData.clientPhone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes ou questions (optionnel)</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="notes"
                    placeholder="Ajoutez des informations supplémentaires..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                    className="pl-9 min-h-[80px]"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('time')}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !bookingData.clientName || !bookingData.clientEmail}
                  className="flex-1"
                >
                  {isSubmitting ? "Confirmation..." : "Confirmer le rendez-vous"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingCalendar;