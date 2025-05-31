"use client";
import React, { useState } from "react";

const ReportIssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

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

        {/* Map Placeholder */}
        <div className="mb-4 w-full h-64 bg-[#2E5A88] flex items-center justify-center rounded-md">
          <p className="text-white text-sm">🗺️ Map will appear here (next step)</p>
        </div>

        {/* Coordinates */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-2 text-sm font-medium">Latitude</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2 rounded-md bg-[#2E5A88] text-white"
              value={lat || ""}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-2 text-sm font-medium">Longitude</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2 rounded-md bg-[#2E5A88] text-white"
              value={lng || ""}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-2 bg-[#457B9D] hover:bg-[#35607d] rounded-md font-semibold"
        >
          Submit Issue
        </button>
      </div>
    </div>
  );
};

export default ReportIssueForm;
