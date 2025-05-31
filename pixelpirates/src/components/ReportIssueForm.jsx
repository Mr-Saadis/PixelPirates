'use client';
import React, { useState, useEffect } from 'react';
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

// Map click marker
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
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');

  const router = useRouter();

  // 🔄 Fetch department list
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from('depmartment').select('*');
      console.log('Departments:', data); // Debugging line
      if (error) {
        toast.error('⚠️ Failed to load departments');
      } else {
        setDepartments(data);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !lat || !lng || !selectedDeptId) {
      toast.error('⚠️ Please fill all fields and select a department and location.');
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
        dep_id: selectedDeptId, // ✅ added dept_id here
      },
    ]);

    if (error) {
      toast.error('❌ ' + error.message);
    } else {
      toast.success('✅ Issue reported!');
      router.push('/citizendashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D3557] via-[#2E5A88] to-[#457B9D] p-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-xl text-white animate-slide-up">
        <h2 className="text-2xl font-bold mb-6 text-center tracking-wide drop-shadow">
          📍 Report a City Issue
        </h2>

        {/* Title */}
        <label className="block mb-2 text-sm font-medium">Title</label>
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 rounded-md bg-white/10 backdrop-blur-md placeholder-gray-300 text-white"
          placeholder="e.g., Broken Street Light"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          rows={4}
          className="w-full mb-4 px-4 py-2 rounded-md bg-white/10 backdrop-blur-md placeholder-gray-300 text-white"
          placeholder="Describe the issue in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Department Selector */}
        <label className="block mb-2 text-sm font-medium">Select Department</label>
        <select
          value={selectedDeptId}
          onChange={(e) => setSelectedDeptId(Number(e.target.value))}
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white"
        >
          <option value="">-- Select a Department --</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.department_name}
            </option>
          ))}
        </select>

        {/* Map */}
        <label className="block mb-2 text-sm font-medium">Select Location</label>
        <div className="mb-4 w-full h-64 rounded-md overflow-hidden">
          <MapContainer center={[31.5204, 74.3587]} zoom={13} style={{ height: '100%', width: '100%' }}>
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

        {/* Submit */}
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
