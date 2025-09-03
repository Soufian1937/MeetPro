import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import CreateEventDialog from '../components/CreateEventDialog';
import EventManagement from '../components/EventManagement';
import PricingUpgrade from '../components/PricingUpgrade';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Plus, Settings, Users, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { events, bookings, loading } = useEvents();
  
  useEffect(() => {
    console.log('Dashboard - Events updated:', events);
    console.log('Dashboard - Bookings updated:', bookings);
  }, [events, bookings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  const activeEvents = events?.filter(event => event.is_active) || [];
  const totalBookings = bookings?.length || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  
  // Logique du plan gratuit
  const currentPlan = 'free'; // Pour l'instant, tous les utilisateurs sont sur le plan gratuit
  const maxEventsForFreePlan = 10;
  const canCreateMoreEvents = events.length < maxEventsForFreePlan;
  
  console.log('Dashboard render - Active events:', activeEvents.length);
  console.log('Dashboard render - Total events:', events?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="ml-3 text-xl font-semibold hero-gradient bg-clip-text text-transparent">
                MeetSync Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Bienvenue, {user?.user_metadata?.first_name || user?.email}
              </span>
              <Button variant="outline" onClick={signOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Événements Actifs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Types d'événements actifs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réservations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
              <p className="text-xs text-muted-foreground">
                Réservations confirmées
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                Toutes les réservations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Upgrade Section - Affiché seulement pour le plan gratuit */}
        {currentPlan === 'free' && (
          <PricingUpgrade 
            currentPlan={currentPlan}
            eventsCount={events.length}
            maxEvents={maxEventsForFreePlan}
          />
        )}

        {/* Event Management Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Types d'Événements</h2>
              <p className="text-muted-foreground">
                Créez et gérez vos types d'événements réservables
              </p>
            </div>
            {canCreateMoreEvents ? (
              <CreateEventDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un Événement
                </Button>
              </CreateEventDialog>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/#pricing'}
                className="relative"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un Événement
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Pro
                </span>
              </Button>
            )}
          </div>

          {events && events.length > 0 ? (
            <div className="space-y-6">
              {events.map((event) => (
                <EventManagement key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun type d'événement</h3>
                <p className="text-muted-foreground mb-4">
                  Créez votre premier type d'événement pour commencer à accepter des réservations
                </p>
                {canCreateMoreEvents ? (
                  <CreateEventDialog>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un Événement
                    </Button>
                  </CreateEventDialog>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/#pricing'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un Événement (Pro)
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}