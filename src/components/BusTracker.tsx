import React, { useState, useEffect } from 'react';
import { Clock, Users, MapPin, AlertCircle, Phone, Share2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface BusData {
  id: string;
  routeNumber: string;
  currentLocation: string;
  nextStop: string;
  eta: number;
  occupancy: 'low' | 'medium' | 'high';
  status: 'on-time' | 'delayed' | 'cancelled';
  totalStops: number;
  completedStops: number;
  driverName: string;
  busNumber: string;
}

interface BusTrackerProps {
  routeNumber: string;
  onBack: () => void;
}

export default function BusTracker({ routeNumber, onBack }: BusTrackerProps) {
  const [busData, setBusData] = useState<BusData | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching bus data
    const mockBusData: BusData = {
      id: 'bus-tracker-1',
      routeNumber,
      currentLocation: 'Near Central Market',
      nextStop: 'Medical College Gate',
      eta: 3,
      occupancy: 'medium',
      status: 'on-time',
      totalStops: 12,
      completedStops: 8,
      driverName: 'Raj Kumar',
      busNumber: 'UP-14-AB-1234'
    };

    setBusData(mockBusData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setBusData(prev => {
        if (!prev) return prev;

        const newEta = Math.max(0, prev.eta - 0.5);
        const progress = Math.min(prev.completedStops + 0.1, prev.totalStops);

        return {
          ...prev,
          eta: newEta,
          completedStops: progress,
          currentLocation: newEta <= 1 ? 'Approaching your stop' : prev.currentLocation
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [routeNumber]);

  const getOccupancyInfo = (occupancy: string) => {
    switch (occupancy) {
      case 'low': return { color: 'text-green-600 bg-green-50', label: 'Plenty of seats', percentage: 30 };
      case 'medium': return { color: 'text-yellow-600 bg-yellow-50', label: 'Moderate crowd', percentage: 65 };
      case 'high': return { color: 'text-red-600 bg-red-50', label: 'Crowded', percentage: 90 };
      default: return { color: 'text-gray-600 bg-gray-50', label: 'Unknown', percentage: 50 };
    }
  };

  const handleShareTrip = () => {
    const message = `I'm tracking ${routeNumber} - arriving in ${busData?.eta} minutes at ${busData?.nextStop}. Track with SafeSafar!`;

    if (navigator.share) {
      navigator.share({
        title: 'SafeSafar Trip',
        text: message,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: 'Trip details copied!',
        description: 'Share the link with your family',
      });
    }
  };

  const handleEmergencyContact = () => {
    toast({
      title: 'Emergency contacts',
      description: 'Police: 100 | Ambulance: 108 | Bus Helpline: 1950',
    });
  };

  if (!busData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Connecting to bus...</p>
        </div>
      </div>
    );
  }

  const occupancyInfo = getOccupancyInfo(busData.occupancy);
  const progressPercentage = (busData.completedStops / busData.totalStops) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{busData.routeNumber}</h2>
          <p className="text-sm text-muted-foreground">Live Tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShareTrip}>
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsTracking(!isTracking)}>
            <Star className={`w-4 h-4 mr-1 ${isTracking ? 'fill-current' : ''}`} />
            {isTracking ? 'Tracking' : 'Track'}
          </Button>
        </div>
      </div>

      {/* Main Status Card */}
      <Card className="transit-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">Next Arrival</span>
            <Badge
              variant={busData.status === 'on-time' ? 'default' : 'secondary'}
              className={busData.status === 'on-time' ? 'status-live' : 'status-delayed'}
            >
              {busData.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ETA Display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">
              {busData.eta}
              <span className="text-lg text-muted-foreground ml-1">min</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{busData.nextStop}</p>
              <p className="text-xs text-muted-foreground">{busData.currentLocation}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Route Progress</span>
              <span>{Math.round(busData.completedStops)}/{busData.totalStops} stops</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Bus Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Occupancy Card */}
        <Card className="transit-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Occupancy</span>
            </div>
            <div className="space-y-2">
              <div className={`text-xs px-2 py-1 rounded-full ${occupancyInfo.color} border`}>
                {occupancyInfo.label}
              </div>
              <Progress value={occupancyInfo.percentage} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* Bus Info Card */}
        <Card className="transit-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bus Details</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Number: {busData.busNumber}</p>
              <p>Driver: {busData.driverName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="transit-button h-12"
          onClick={handleEmergencyContact}
        >
          <Phone className="w-4 h-4 mr-2" />
          Emergency
        </Button>
        <Button
          variant="outline"
          className="transit-button h-12"
          onClick={onBack}
        >
          <MapPin className="w-4 h-4 mr-2" />
          View on Map
        </Button>
      </div>

      {/* Safety Notice */}
      <Card className="transit-card border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-amber-900">Safety Reminder</h4>
              <p className="text-xs text-amber-700">
                Please arrive at the bus stop 2-3 minutes before the estimated time.
                Keep your travel documents ready and stay alert.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}