import React from 'react';
import { Button } from '@/components/ui/button';
import { Bus, MapPin, Clock, Shield, Users, Navigation } from 'lucide-react';

interface WelcomeScreenProps {
  onLoginClick: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginClick }) => {
  const features = [
    {
      icon: <Bus className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Live bus locations and accurate ETAs"
    },
    {
      icon: <Navigation className="w-6 h-6" />,
      title: "Smart Routes",
      description: "Optimized journey planning for your commute"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safety First",
      description: "Emergency alerts and safe travel features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 text-center text-white">
          <div className="welcome-content">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <Bus className="w-16 h-16 mr-4 floating-element" />
              <h1 className="text-5xl font-bold">SafeSafar</h1>
            </div>

            {/* Tagline */}
            <p className="text-xl text-white/90 mb-4">Smart Commuting, Safe Journey</p>
            <p className="text-white/70 mb-12 max-w-sm">
              Your trusted companion for reliable public transport in smart cities
            </p>

            {/* Features */}
            <div className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="feature-item flex items-start text-left max-w-sm mx-auto">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="p-6 pb-8">
          <div className="welcome-content">
            <Button
              onClick={onLoginClick}
              className="w-full h-14 bg-white text-primary hover:bg-white/95 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Started
            </Button>

            <p className="text-center text-white/60 text-sm mt-4">
              Join thousands of smart commuters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};