/*
  # Correction de la table events - Ajout de la colonne duration manquante

  1. Modifications
    - Ajout de la colonne `duration` à la table `events` si elle n'existe pas
    - Mise à jour des contraintes et index

  2. Sécurité
    - Maintien des politiques RLS existantes
*/

-- Ajouter la colonne duration si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'duration'
  ) THEN
    ALTER TABLE public.events ADD COLUMN duration INTEGER NOT NULL DEFAULT 30;
  END IF;
END $$;

-- Vérifier que toutes les colonnes nécessaires existent
DO $$
BEGIN
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
END $$;