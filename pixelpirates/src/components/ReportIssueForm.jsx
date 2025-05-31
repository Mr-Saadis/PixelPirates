'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Marker logic on click
const LocationMarker = ({ setLat, setLng }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLat(lat);
      setLng(lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const ReportIssueForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !description || !lat || !lng) {
      toast.error('⚠️ Please fill all fields and select a location.');
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error('🔐 You must be logged in to report an issue.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('issues').insert([
      {
        title,
        description,
        lat,
        lng,
        status: 'pending',
        created_by: user.id,
      },
    ]);

    if (error) {
      toast.error('❌ ' + error.message);
    } else {
      toast.success('✅ Issue reported!');
      router.push('/dashboard'); // change this if you want another route
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1D3557] text-white flex items-center justify-center p-4">
      <div className="bg-[#1D3557] shadow-md rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">📍 Report a City Issue</h2>

        {/* Title */}
        <label className="block mb-2 text-sm font-medium">Title</label>
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white focus:outline-none"
          placeholder="e.g., Broken Street Light"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white focus:outline-none"
          placeholder="Describe the issue in detail..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Leaflet Map */}
        <label className="block mb-2 text-sm font-medium">Select Location</label>
        <div className="mb-4 w-full h-64 rounded-md overflow-hidden">
          <MapContainer
            center={[31.5204, 74.3587]} // Lahore default
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker setLat={setLat} setLng={setLng} />
          </MapContainer>
        </div>

        {/* Coordinates */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-2 text-sm font-medium">Latitude</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2 rounded-md bg-[#2E5A88] text-white"
              value={lat || ''}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-2 text-sm font-medium">Longitude</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2 rounded-md bg-[#2E5A88] text-white"
              value={lng || ''}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-[#457B9D] hover:bg-[#35607d] rounded-md font-semibold"
        >
          {loading ? 'Submitting...' : 'Submit Issue'}
        </button>
      </div>
    </div>
  );
};

export default ReportIssueForm;
