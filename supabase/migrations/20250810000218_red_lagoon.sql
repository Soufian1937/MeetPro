/*
  # Création des tables pour les événements

  1. Nouvelles Tables
    - `event_types` - Types d'événements créés par les utilisateurs
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key vers profiles)
      - `title` (text)
      - `description` (text)
      - `duration` (integer, en minutes)
      - `price` (decimal)
      - `location_type` (enum: 'video', 'physical', 'phone')
      - `location_details` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings` - Réservations des événements
      - `id` (uuid, primary key)
      - `event_type_id` (uuid, foreign key vers event_types)
      - `client_name` (text)
      - `client_email` (text)
      - `client_phone` (text)
      - `scheduled_at` (timestamp)
      - `status` (enum: 'pending', 'confirmed', 'cancelled', 'completed')
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour que les utilisateurs ne voient que leurs propres données
*/

-- Create enum types
CREATE TYPE location_type AS ENUM ('video', 'physical', 'phone');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create event_types table
CREATE TABLE IF NOT EXISTS public.event_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10,2) DEFAULT 0,
  location_type location_type NOT NULL DEFAULT 'video',
  location_details TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type_id UUID NOT NULL REFERENCES public.event_types(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for event_types
CREATE POLICY "Users can view their own event types"
  ON public.event_types
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own event types"
  ON public.event_types
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own event types"
  ON public.event_types
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own event types"
  ON public.event_types
  FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for bookings
CREATE POLICY "Users can view bookings for their events"
  ON public.bookings
  FOR SELECT
  USING (
    event_type_id IN (
      SELECT id FROM public.event_types WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update bookings for their events"
  ON public.bookings
  FOR UPDATE
  USING (
    event_type_id IN (
      SELECT id FROM public.event_types WHERE user_id = auth.uid()
    )
  );

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_event_types_updated_at
  BEFORE UPDATE ON public.event_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_types_user_id ON public.event_types(user_id);
CREATE INDEX IF NOT EXISTS idx_event_types_is_active ON public.event_types(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_event_type_id ON public.bookings(event_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);