import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BusLocation {
  id: string;
  routeNumber: string;
  latitude: number;
  longitude: number;
  occupancy: 'low' | 'medium' | 'high';
  status: 'on-time' | 'delayed' | 'cancelled';
  eta: number; // minutes
}

interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routes: string[];
}

interface MapViewProps {
  selectedRoute?: string;
  onBusSelect?: (bus: BusLocation) => void;
}

export default function MapView({ selectedRoute, onBusSelect }: MapViewProps) {
  const [buses, setBuses] = useState<BusLocation[]>([]);
  const [stops, setStops] = useState<BusStop[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Simulate real-time bus data
  useEffect(() => {
    const mockBuses: BusLocation[] = [
      {
        id: 'bus-1',
        routeNumber: 'Route 15',
        latitude: 28.6139,
        longitude: 77.2090,
        occupancy: 'medium',
        status: 'on-time',
        eta: 3
      },
      {
        id: 'bus-2',
        routeNumber: 'Route 22',
        latitude: 28.6129,
        longitude: 77.2295,
        occupancy: 'high',
        status: 'delayed',
        eta: 8
      },
      {
        id: 'bus-3',
        routeNumber: 'Route 15',
        latitude: 28.6449,
        longitude: 77.2167,
        occupancy: 'low',
        status: 'on-time',
        eta: 12
      }
    ];

    const mockStops: BusStop[] = [
      {
        id: 'stop-1',
        name: 'Central Bus Station',
        latitude: 28.6139,
        longitude: 77.2090,
        routes: ['Route 15', 'Route 22', 'Route 8']
      },
      {
        id: 'stop-2',
        name: 'Medical College',
        latitude: 28.6189,
        longitude: 77.2145,
        routes: ['Route 15', 'Route 8']
      },
      {
        id: 'stop-3',
        name: 'Market Square',
        latitude: 28.6249,
        longitude: 77.2200,
        routes: ['Route 22', 'Route 8']
      }
    ];

    setBuses(mockBuses);
    setStops(mockStops);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Use Delhi coordinates as fallback
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => ({
        ...bus,
        latitude: bus.latitude + (Math.random() - 0.5) * 0.001,
        longitude: bus.longitude + (Math.random() - 0.5) * 0.001,
        eta: Math.max(1, bus.eta + (Math.random() > 0.5 ? -1 : 1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'on-time': return 'default';
      case 'delayed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const filteredBuses = selectedRoute
    ? buses.filter(bus => bus.routeNumber === selectedRoute)
    : buses;

  return (
    <div className="relative w-full h-full bg-muted rounded-xl overflow-hidden">
      {/* Map Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop')`,
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      />

      {/* Map Overlay */}
      <div className="map-overlay" />

      {/* Map Content */}
      <div className="relative z-10 p-4 h-full">

        {/* Map Legend */}
        <Card className="absolute top-4 right-4 w-48 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Active Bus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Bus Stop</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-3 h-3 text-accent" />
                <span>Your Location</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="w-4 h-4 bg-accent rounded-full shadow-lg border-2 border-white animate-pulse"></div>
          </div>
        )}

        {/* Bus Stops */}
        {stops.map((stop) => (
          <div
            key={stop.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`
            }}
          >
            <div className="relative group">
              <div className="w-6 h-6 bg-primary rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>

              {/* Stop Info Tooltip */}
              <Card className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm">
                <CardContent className="p-2">
                  <div className="text-xs space-y-1">
                    <div className="font-medium">{stop.name}</div>
                    <div className="text-muted-foreground">
                      Routes: {stop.routes.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {/* Active Buses */}
        {filteredBuses.map((bus, index) => (
          <div
            key={bus.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${30 + index * 20}%`,
              top: `${30 + index * 15}%`
            }}
            onClick={() => onBusSelect?.(bus)}
          >
            <div className="relative group">
              {/* Bus Icon */}
              <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-lg border-2 border-white flex items-center justify-center">
                <div className="w-4 h-3 bg-white rounded-sm"></div>
              </div>

              {/* Bus Info Card */}
              <Card className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-56 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{bus.routeNumber}</span>
                      <Badge variant={getStatusVariant(bus.status)} className="text-xs">
                        {bus.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{bus.eta} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <div className={`w-2 h-2 rounded-full ${getOccupancyColor(bus.occupancy)}`}></div>
                        <span className="capitalize">{bus.occupancy}</span>
                      </div>
                    </div>

                    {bus.status === 'delayed' && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Running 5 minutes behind schedule</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {/* Map Controls */}
        <div className="absolute bottom-4 left-4 space-y-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
            onClick={() => {
              // Center map on user location
              console.log('Center on user location');
            }}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}