import React, { useState } from 'react';
import MapView from "../MapView";

// SAFE UI IMPORTS
const Button = ({ children, ...props }: any) => <button {...props}>{children}</button>;
const Input = (props: any) => <input {...props} />;
const Card = ({ children }: any) => <div style={{border:"1px solid #ccc", padding:"10px"}}>{children}</div>;
const CardContent = ({ children }: any) => <div>{children}</div>;

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'map' | 'routes'>('search');
  const [searchQuery, setSearchQuery] = useState('');

  const nearbyStops = [
    { id: 1, name: "City Center Mall", distance: "150m" },
    { id: 2, name: "Railway Station", distance: "300m" },
  ];

  const quickRoutes = [
    {
      id: 1,
      from: "Home",
      to: "Office",
      duration: "25 min",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      
      <h1>SafeSafar</h1>

      {/* SEARCH */}
      <Input
        placeholder="Search route..."
        value={searchQuery}
        onChange={(e: any) => setSearchQuery(e.target.value)}
      />

      {/* TABS */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setActiveTab('search')}>Routes</button>
        <button onClick={() => setActiveTab('map')}>Map</button>
        <button onClick={() => setActiveTab('routes')}>Tracking</button>
      </div>

      {/* CONTENT */}
      <main style={{ marginTop: "20px" }}>
        {activeTab === 'search' && (
          <>
            <h2>Quick Routes</h2>
            {quickRoutes.map((r) => (
              <Card key={r.id}>
                <CardContent>
                  {r.from} → {r.to} ({r.duration})
                </CardContent>
              </Card>
            ))}

            <h2>Nearby Stops</h2>
            {nearbyStops.map((s) => (
              <Card key={s.id}>
                <CardContent>
                  {s.name} ({s.distance})
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'map' && <MapView />}
        {activeTab === 'routes' && <div>Tracking Page</div>}
      </main>
    </div>
  );
};