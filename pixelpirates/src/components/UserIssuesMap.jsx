'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '@/lib/supabaseClient';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Red marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UserIssuesMap = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchUserIssues = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('created_by', user.id);

      if (!error) setIssues(data);
    };

    fetchUserIssues();
  }, []);

  return (
    <div className="h-[75vh] rounded-xl overflow-hidden border-2 border-white shadow-lg">
      <MapContainer center={[31.5204, 74.3587]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {issues.map((issue) => (
          <Marker key={issue.id} position={[issue.lat, issue.lng]}>
            <Popup>
              <strong>{issue.title}</strong>
              <br />
              <span>Status: {issue.status}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default UserIssuesMap;
