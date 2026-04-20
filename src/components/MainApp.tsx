import { useEffect, useMemo, useState } from "react";
import { Bell, LogOut, Signal, SignalHigh, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RouteSelector, { ROUTES, type Route } from "@/components/RouteSelector";
import MapView from "@/components/MainView";
import BusTracker from "@/components/BusTracker";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

type MainTab = "discover" | "map" | "tracker";

export const MainApp = () => {
  const SAFETY_TIPS = [
    "Stay in well-lit waiting areas at night.",
    "Share your live trip details with family.",
    "Keep emergency numbers accessible while traveling.",
  ];
  const SAFETY_TIP_ROTATION_INTERVAL_MS = 6000;

  const [activeTab, setActiveTab] = useState<MainTab>("discover");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [networkOnline, setNetworkOnline] = useState(navigator.onLine);
  const [safetyTipIndex, setSafetyTipIndex] = useState(0);
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const onOnline = () => setNetworkOnline(true);
    const onOffline = () => setNetworkOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSafetyTipIndex((prev) => (prev + 1) % SAFETY_TIPS.length);
    }, SAFETY_TIP_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [SAFETY_TIPS.length, SAFETY_TIP_ROTATION_INTERVAL_MS]);

  const greetingName = useMemo(() => {
    if (!user?.name) return "Commuter";
    return user.name.split(" ")[0];
  }, [user?.name]);

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    setActiveTab("map");
    toast({
      title: `${route.number} selected`,
      description: "Live map updated for your chosen route.",
    });
  };

  const handleBusSelect = (bus: { routeNumber: string }) => {
    if (selectedRoute && selectedRoute.number === bus.routeNumber) {
      setActiveTab("tracker");
      return;
    }

    const routeFromCatalog = ROUTES.find((route) => route.number === bus.routeNumber);
    if (!routeFromCatalog) {
      toast({
        title: "Route details unavailable",
        description: "Please select this route from Discover to start detailed tracking.",
        variant: "destructive",
      });
      return;
    }

    setSelectedRoute(routeFromCatalog);
    setActiveTab("tracker");
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Signed out",
      description: "You have been logged out securely.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl p-4 md:p-6 space-y-4">
        <header className="transit-card p-4 md:p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">SafeSafar Command Center</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {greetingName}. Plan smarter, travel safer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={networkOnline ? "outline" : "destructive"}>
              {networkOnline ? (
                <SignalHigh className="w-3 h-3 mr-1" />
              ) : (
                <Signal className="w-3 h-3 mr-1" />
              )}
              {networkOnline ? "Online" : "Offline"}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="transit-card md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Smart Safety Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{SAFETY_TIPS[safetyTipIndex]}</CardContent>
          </Card>
          <Card className="transit-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-warning" />
                Alert Status
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {selectedRoute
                ? `Tracking alerts enabled for ${selectedRoute.number}.`
                : "Select a route to enable trip alerts."}
            </CardContent>
          </Card>
        </section>

        <section className="transit-card p-2 grid grid-cols-3 gap-2">
          <Button
            variant={activeTab === "discover" ? "default" : "ghost"}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </Button>
          <Button variant={activeTab === "map" ? "default" : "ghost"} onClick={() => setActiveTab("map")}>
            Live Map
          </Button>
          <Button
            variant={activeTab === "tracker" ? "default" : "ghost"}
            onClick={() => setActiveTab("tracker")}
            disabled={!selectedRoute}
          >
            Tracker
          </Button>
        </section>

        {activeTab === "discover" && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-4">
            <Card className="transit-card">
              <CardHeader>
                <CardTitle>Find the best route</CardTitle>
                <CardDescription>Search routes by destination, stop, or route number.</CardDescription>
              </CardHeader>
              <CardContent>
                <RouteSelector
                  onRouteSelect={handleRouteSelect}
                  selectedRoute={selectedRoute?.number}
                />
              </CardContent>
            </Card>

            <Card className="transit-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-warning" />
                  Commute readiness
                </CardTitle>
                <CardDescription>Quick snapshot before you start your journey.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Network state</span>
                  <span className="font-medium">{networkOnline ? "Stable" : "Limited"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected route</span>
                  <span className="font-medium">{selectedRoute?.number ?? "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated wait</span>
                  <span className="font-medium">
                    {selectedRoute ? `${selectedRoute.nextArrival} min` : "--"}
                  </span>
                </div>
                <Button
                  className="w-full mt-2"
                  disabled={!selectedRoute}
                  onClick={() => setActiveTab("map")}
                >
                  Go to live map
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {activeTab === "map" && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.25fr,0.75fr] gap-4">
            <Card className="transit-card min-h-[480px]">
              <CardContent className="p-3 h-[480px]">
                <MapView
                  selectedRoute={selectedRoute?.number}
                  onBusSelect={handleBusSelect}
                />
              </CardContent>
            </Card>

            <Card className="transit-card">
              <CardHeader>
                <CardTitle>Route intelligence</CardTitle>
                <CardDescription>
                  {selectedRoute
                    ? `Monitoring ${selectedRoute.number}`
                    : "Choose a route to unlock route analytics"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {selectedRoute ? (
                  <>
                    <div className="flex justify-between">
                      <span>Coverage</span>
                      <span className="font-medium">
                        {selectedRoute.from} → {selectedRoute.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency</span>
                      <span className="font-medium">{selectedRoute.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active buses</span>
                      <span className="font-medium">{selectedRoute.activeBuses}</span>
                    </div>
                    <Button className="w-full" onClick={() => setActiveTab("tracker")}>
                      Open live tracker
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Use Discover tab to select a route, then return here for live tracking and ETA intelligence.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("discover")}>
                      Choose a route
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {activeTab === "tracker" && (
          <section className="transit-card p-4">
            {selectedRoute ? (
              <BusTracker routeNumber={selectedRoute.number} onBack={() => setActiveTab("map")} />
            ) : (
              <div className="text-center py-10 text-muted-foreground">Select a route to start tracking.</div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
