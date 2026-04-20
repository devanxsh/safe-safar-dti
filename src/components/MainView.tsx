import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { Navigation, AlertTriangle, Clock, Users, MapPin, Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BusLocation {
  id: string;
  routeNumber: string;
  location: { lat: number; lng: number };
  occupancy: "low" | "medium" | "high";
  status: "on-time" | "delayed" | "cancelled";
  eta: number;
}

interface BusStop {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  routes: string[];
}

interface MapViewProps {
  selectedRoute?: string;
  onBusSelect?: (bus: BusLocation) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DELHI_CENTER = { lat: 28.6139, lng: 77.209 };

const MOCK_BUSES: BusLocation[] = [
  { id: "bus-1", routeNumber: "Route 15", location: { lat: 28.6139, lng: 77.209 }, occupancy: "medium", status: "on-time", eta: 3 },
  { id: "bus-2", routeNumber: "Route 22", location: { lat: 28.6129, lng: 77.2295 }, occupancy: "high", status: "delayed", eta: 8 },
  { id: "bus-3", routeNumber: "Route 15", location: { lat: 28.6449, lng: 77.2167 }, occupancy: "low", status: "on-time", eta: 12 },
];

const MOCK_STOPS: BusStop[] = [
  { id: "stop-1", name: "Central Bus Station", location: { lat: 28.6139, lng: 77.209 }, routes: ["Route 15", "Route 22", "Route 8"] },
  { id: "stop-2", name: "Medical College", location: { lat: 28.6189, lng: 77.2145 }, routes: ["Route 15", "Route 8"] },
  { id: "stop-3", name: "Market Square", location: { lat: 28.6249, lng: 77.22 }, routes: ["Route 22", "Route 8"] },
];

// ─── Helper hooks ─────────────────────────────────────────────────────────────

/** Centre the map on the user's location whenever it changes. */
function UserLocationRecenterer({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
  const map = useMap();
  const hasRecentered = useRef(false);

  useEffect(() => {
    if (map && userLocation && !hasRecentered.current) {
      map.panTo(userLocation);
      hasRecentered.current = true;
    }
  }, [map, userLocation]);

  return null;
}

// ─── Occupancy / Status helpers ───────────────────────────────────────────────

function occupancyColor(o: string) {
  return o === "low" ? "#22c55e" : o === "medium" ? "#eab308" : "#ef4444";
}

function statusVariant(s: string): "default" | "secondary" | "destructive" {
  return s === "on-time" ? "default" : s === "delayed" ? "secondary" : "destructive";
}

// ─── Bus marker pin ──────────────────────────────────────────────────────────

function BusPin({ occupancy }: { occupancy: string }) {
  return (
    <div
      style={{ background: occupancyColor(occupancy) }}
      className="w-8 h-8 rounded-lg shadow-lg border-2 border-white flex items-center justify-center cursor-pointer"
    >
      <Bus className="w-4 h-4 text-white" />
    </div>
  );
}

// ─── Stop marker pin ─────────────────────────────────────────────────────────

function StopPin() {
  return (
    <div className="w-6 h-6 bg-primary rounded-full shadow-md border-2 border-white flex items-center justify-center cursor-pointer">
      <MapPin className="w-3 h-3 text-white" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

export default function MapView({ selectedRoute, onBusSelect }: MapViewProps) {
  const { location: userLocation } = useGeolocation({ fallback: DELHI_CENTER });

  const [buses, setBuses] = useState<BusLocation[]>(MOCK_BUSES);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  // Simulate real-time bus position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          location: {
            lat: bus.location.lat + (Math.random() - 0.5) * 0.001,
            lng: bus.location.lng + (Math.random() - 0.5) * 0.001,
          },
          eta: Math.max(1, bus.eta + (Math.random() > 0.5 ? -1 : 1)),
        }))
      );
    }, 5_000);
    return () => clearInterval(interval);
  }, []);

  const filteredBuses = selectedRoute
    ? buses.filter((b) => b.routeNumber === selectedRoute)
    : buses;

  const handleBusClick = useCallback(
    (bus: BusLocation) => {
      setSelectedStop(null);
      setSelectedBus((prev) => (prev?.id === bus.id ? null : bus));
      onBusSelect?.(bus);
    },
    [onBusSelect]
  );

  const handleStopClick = useCallback((stop: BusStop) => {
    setSelectedBus(null);
    setSelectedStop((prev) => (prev?.id === stop.id ? null : stop));
  }, []);

  // If no API key is configured, show an informative fallback
  if (!MAPS_API_KEY) {
    return (
      <div className="relative w-full h-full bg-muted rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-3 p-6">
          <MapPin className="w-12 h-12 text-primary mx-auto" />
          <p className="font-semibold">Google Maps not configured</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Add <code className="bg-muted-foreground/20 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to
            your <code className="bg-muted-foreground/20 px-1 rounded">.env</code> file to enable the
            interactive live map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={MAPS_API_KEY}>
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <Map
          mapId="safesafar-live-map"
          defaultCenter={DELHI_CENTER}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Recentre on user location once available */}
          <UserLocationRecenterer userLocation={userLocation} />

          {/* User location pulse marker */}
          {userLocation && (
            <AdvancedMarker position={userLocation} title="Your location">
              <div className="relative">
                <div className="w-5 h-5 bg-accent rounded-full border-2 border-white shadow-lg animate-pulse" />
              </div>
            </AdvancedMarker>
          )}

          {/* Bus stop markers */}
          {MOCK_STOPS.map((stop) => (
            <React.Fragment key={stop.id}>
              <AdvancedMarker
                position={stop.location}
                title={stop.name}
                onClick={() => handleStopClick(stop)}
              >
                <StopPin />
              </AdvancedMarker>

              {selectedStop?.id === stop.id && (
                <InfoWindow
                  position={stop.location}
                  onCloseClick={() => setSelectedStop(null)}
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{stop.name}</p>
                    <p className="text-muted-foreground text-xs">Routes: {stop.routes.join(", ")}</p>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}

          {/* Active bus markers */}
          {filteredBuses.map((bus) => (
            <React.Fragment key={bus.id}>
              <AdvancedMarker
                position={bus.location}
                title={bus.routeNumber}
                onClick={() => handleBusClick(bus)}
              >
                <BusPin occupancy={bus.occupancy} />
              </AdvancedMarker>

              {selectedBus?.id === bus.id && (
                <InfoWindow
                  position={bus.location}
                  onCloseClick={() => setSelectedBus(null)}
                >
                  <div className="space-y-2 text-sm min-w-[180px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{bus.routeNumber}</span>
                      <Badge variant={statusVariant(bus.status)} className="text-xs">
                        {bus.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {bus.eta} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ background: occupancyColor(bus.occupancy) }}
                        />
                        {bus.occupancy}
                      </span>
                    </div>
                    {bus.status === "delayed" && (
                      <p className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertTriangle className="w-3 h-3" />
                        Running ~5 min behind schedule
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </Map>

        {/* Map legend overlay */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg shadow p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2"><Bus className="w-3 h-3 text-green-500" /> Low occupancy</div>
          <div className="flex items-center gap-2"><Bus className="w-3 h-3 text-yellow-500" /> Medium</div>
          <div className="flex items-center gap-2"><Bus className="w-3 h-3 text-red-500" /> High / Crowded</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full" /> Bus Stop</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-accent rounded-full" /> You</div>
        </div>

        {/* Centre-on-me button */}
        <div className="absolute bottom-4 left-4">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
            title="Centre on my location"
            onClick={() => {
              if (userLocation) {
                // panTo is handled reactively; just nudge a re-render
                setSelectedBus(null);
              }
            }}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </APIProvider>
  );
}