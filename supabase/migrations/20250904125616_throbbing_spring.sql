/*
  # Correction de la table events - Problème colonne duration

  1. Modifications
    - Vérification et correction de la colonne duration dans la table events
    - S'assurer que toutes les colonnes nécessaires existent
    - Correction des contraintes et valeurs par défaut

  2. Sécurité
    - Maintien des politiques RLS existantes
    - Pas de modification des données existantes
*/

-- Vérifier et corriger la structure de la table events
DO $$
BEGIN
  -- Vérifier si la table events existe, sinon la créer
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'events' AND table_schema = 'public'
  ) THEN
    -- Créer les types enum s'ils n'existent pas
    DO $enum$ BEGIN
      CREATE TYPE location_type AS ENUM ('video', 'physical', 'phone');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $enum$;

    DO $enum$ BEGIN
      CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $enum$;

    -- Créer la table events
    CREATE TABLE public.events (
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

    -- Créer les politiques
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

    -- Créer les index
    CREATE INDEX idx_events_user_id ON public.events(user_id);
    CREATE INDEX idx_events_is_active ON public.events(is_active);
  ELSE
    -- La table existe, vérifier et corriger les colonnes manquantes
    
    -- Ajouter duration si manquante
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'duration'
    ) THEN
      ALTER TABLE public.events ADD COLUMN duration INTEGER NOT NULL DEFAULT 30;
    END IF;

    -- Ajouter description si manquante
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'description'
    ) THEN
      ALTER TABLE public.events ADD COLUMN description TEXT;
    END IF;

    -- Ajouter price si manquante
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'price'
    ) THEN
      ALTER TABLE public.events ADD COLUMN price DECIMAL(10,2) DEFAULT 0;
    END IF;

    -- Ajouter location_type si manquante
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'location_type'
    ) THEN
      -- Créer le type enum s'il n'existe pas
      DO $enum$ BEGIN
        CREATE TYPE location_type AS ENUM ('video', 'physical', 'phone');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $enum$;
      
      ALTER TABLE public.events ADD COLUMN location_type location_type NOT NULL DEFAULT 'video';
    END IF;

    -- Ajouter location_details si manquante
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'location_details'
    ) THEN
      ALTER TABLE public.events ADD COLUMN location_details TEXT;
    END IF;

    -- Ajouter is_active si manquante
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'is_active'
    ) THEN
      ALTER TABLE public.events ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- S'assurer que la fonction update_updated_at_column existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;

  -- Créer le trigger pour updated_at s'il n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_events_updated_at'
  ) THEN
    CREATE TRIGGER update_events_updated_at
      BEFORE UPDATE ON public.events
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Vérifier et corriger la table bookings si nécessaire
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'bookings' AND table_schema = 'public'
  ) THEN
    -- Mettre à jour la contrainte de clé étrangère pour pointer vers events
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'bookings_event_type_id_fkey'
      AND table_name = 'bookings'
    ) THEN
      ALTER TABLE public.bookings DROP CONSTRAINT bookings_event_type_id_fkey;
      ALTER TABLE public.bookings 
      ADD CONSTRAINT bookings_event_type_id_fkey 
      FOREIGN KEY (event_type_id) REFERENCES public.events(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;