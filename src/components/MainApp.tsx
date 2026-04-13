import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Clock,
  Users,
  Navigation,
  Star,
  Menu,
  Bell,
  User,
  Settings
} from 'lucide-react';
import MapView from './MapView';
import RouteSelector from './RouteSelector';
import BusTracker from './BusTracker';
import { AuthModal } from './AuthModal';
import { useAuthStore } from '@/store/auth-store';

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'map' | 'routes'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuthStore();

  const nearbyStops = [
    { id: 1, name: "City Center Mall", distance: "150m", buses: ["12A", "45B", "78C"] },
    { id: 2, name: "Railway Station", distance: "300m", buses: ["12A", "23D", "67E"] },
    { id: 3, name: "Hospital Junction", distance: "450m", buses: ["45B", "78C", "89F"] },
  ];

  const quickRoutes = [
    {
      id: 1,
      from: "Home",
      to: "Office",
      duration: "25 min",
      buses: ["12A", "45B"],
      nextBus: "3 min",
      isFavorite: true
    },
    {
      id: 2,
      from: "City Center",
      to: "University",
      duration: "18 min",
      buses: ["78C"],
      nextBus: "7 min",
      isFavorite: false
    },
  ];

  const handleLogout = () => {
    logout();
    setShowAuthModal(true);
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Please log in to continue</h2>
              <Button onClick={() => setShowAuthModal(true)} className="w-full">
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <div className="app-enter min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold">SafeSafar</h1>
                <p className="text-xs text-primary-foreground/80">Good morning, {user.email.split('@')[0]}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-4 bg-primary/5 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Where do you want to go?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-background border-2 border-primary/20 focus:border-primary rounded-xl"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-background border-b sticky top-[88px] z-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Navigation className="w-4 h-4 mx-auto mb-1" />
            Routes
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="w-4 h-4 mx-auto mb-1" />
            Live Map
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'routes'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4 mx-auto mb-1" />
            Tracking
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="pb-20">
        {activeTab === 'search' && (
          <div className="p-4 space-y-6">
            {/* Quick Routes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Quick Routes</h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {quickRoutes.map((route) => (
                  <Card key={route.id} className="transit-card hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-success rounded-full"></div>
                              <span className="font-medium">{route.from}</span>
                            </div>
                            <Navigation className="w-4 h-4 text-muted-foreground" />
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-destructive rounded-full"></div>
                              <span className="font-medium">{route.to}</span>
                            </div>
                            {route.isFavorite && (
                              <Star className="w-4 h-4 text-secondary fill-current" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{route.duration}</span>
                            </span>
                            <span>Next bus: {route.nextBus}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {route.buses.map((bus) => (
                              <Badge key={bus} variant="outline" className="text-xs">
                                {bus}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" className="ml-4">
                          Track
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Nearby Stops */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Nearby Stops</h2>
              <div className="space-y-3">
                {nearbyStops.map((stop) => (
                  <Card key={stop.id} className="transit-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{stop.name}</h3>
                            <p className="text-sm text-muted-foreground">{stop.distance} • {stop.buses.length} buses</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {stop.buses.slice(0, 3).map((bus) => (
                                <Badge key={bus} variant="secondary" className="text-xs">
                                  {bus}
                                </Badge>
                              ))}
                              {stop.buses.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{stop.buses.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'map' && <MapView />}
        {activeTab === 'routes' && <BusTracker routeNumber="12A" onBack={() => setActiveTab('search')} />}
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
