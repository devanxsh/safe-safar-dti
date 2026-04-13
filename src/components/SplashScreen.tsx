import React, { useEffect, useState } from 'react';
import { Bus, MapPin, Clock } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out animation to complete
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="splash-logo flex items-center justify-center mb-4">
          <Bus className="w-12 h-12 mr-3 bus-move" />
          <span>SafeSafar</span>
        </div>

        {/* Tagline */}
        <p className="splash-tagline">Smart Commuting, Safe Journey</p>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-1/4 left-1/4">
            <MapPin className="w-6 h-6 text-white/30" />
          </div>
          <div className="floating-element absolute top-1/3 right-1/4" style={{ animationDelay: '1s' }}>
            <Clock className="w-6 h-6 text-white/30" />
          </div>
          <div className="floating-element absolute bottom-1/3 left-1/3" style={{ animationDelay: '2s' }}>
            <Bus className="w-6 h-6 text-white/30" />
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-2 h-2 bg-white/60 rounded-full pulse-dot"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full pulse-dot" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full pulse-dot" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};
