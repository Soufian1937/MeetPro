import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type EventType = Database['public']['Tables']['event_types']['Row'];
type EventTypeInsert = Database['public']['Tables']['event_types']['Insert'];
type EventTypeUpdate = Database['public']['Tables']['event_types']['Update'];
type Booking = Database['public']['Tables']['bookings']['Row'];

export function useEvents() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger les événements
  const fetchEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_types')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les événements",
      });
    }
  };

  // Charger les réservations
  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          event_types (
            title,
            duration
          )
        `)
        .in('event_type_id', events.map(e => e.id))
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les réservations",
      });
    }
  };

  // Créer un événement
  const createEvent = async (eventData: Omit<EventTypeInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('event_types')
        .insert({
          ...eventData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Événement créé avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer l'événement",
      });
      return null;
    }
  };

  // Mettre à jour un événement
  const updateEvent = async (id: string, eventData: EventTypeUpdate) => {
    try {
      const { data, error } = await supabase
        .from('event_types')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === id ? data : event
      ));

      toast({
        title: "Succès",
        description: "Événement mis à jour avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'événement",
      });
      return null;
    }
  };

  // Supprimer un événement
  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
      });
      return false;
    }
  };

  // Mettre à jour le statut d'une réservation
  const updateBookingStatus = async (id: string, status: Database['public']['Enums']['booking_status']) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === id ? data : booking
      ));

      toast({
        title: "Succès",
        description: "Statut de la réservation mis à jour",
      });

      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchEvents().finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (events.length > 0) {
      fetchBookings();
    }
  }, [events]);

  return {
    events,
    bookings,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    updateBookingStatus,
    refetch: () => {
      fetchEvents();
      fetchBookings();
    }
  };
}