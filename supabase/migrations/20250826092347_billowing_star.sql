/*
  # Correction de la table events

  1. Nouvelles Tables
    - `events` - Table principale pour les événements (remplace event_types)
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

  2. Sécurité
    - Enable RLS sur la table events
    - Politiques pour que les utilisateurs ne voient que leurs propres données

  3. Modifications
    - Mise à jour de la table bookings pour référencer events au lieu de event_types
*/

-- Create events table (principale)
CREATE TABLE IF NOT EXISTS public.events (
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

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Users can view their own events"
  ON public.events
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own events"
  ON public.events
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own events"
  ON public.events
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own events"
  ON public.events
  FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update bookings table to reference events instead of event_types
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookings_event_type_id_fkey'
  ) THEN
    ALTER TABLE public.bookings DROP CONSTRAINT bookings_event_type_id_fkey;
  END IF;
  
  -- Add new foreign key constraint to events table
  ALTER TABLE public.bookings 
  ADD CONSTRAINT bookings_event_type_id_fkey 
  FOREIGN KEY (event_type_id) REFERENCES public.events(id) ON DELETE CASCADE;
END $$;

-- Update RLS policy for bookings to reference events table
DROP POLICY IF EXISTS "Users can view bookings for their events" ON public.bookings;
DROP POLICY IF EXISTS "Users can update bookings for their events" ON public.bookings;

CREATE POLICY "Users can view bookings for their events"
  ON public.bookings
  FOR SELECT
  USING (
    event_type_id IN (
      SELECT id FROM public.events WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update bookings for their events"
  ON public.bookings
  FOR UPDATE
  USING (
    event_type_id IN (
      SELECT id FROM public.events WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON public.events(is_active);