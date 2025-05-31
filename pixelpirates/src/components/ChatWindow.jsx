'use client';

import React, { useState } from 'react';

const ChatWindow = () => {
  const [message, setMessage] = useState('');

  const staticMessages = [
    { id: 1, sender: 'Admin', content: 'Welcome! How can we help you today?' },
    { id: 2, sender: 'You', content: 'The water pipe is leaking on 5th street.' },
    { id: 3, sender: 'Admin', content: 'Thank you. The sanitation team will be alerted.' },
    { id: 4, sender: 'You', content: 'Appreciate it!' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D3557] via-[#2E5A88] to-[#457B9D] p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="grid grid-cols-3">
          {/* Sidebar */}
          <div className="col-span-1 bg-[#1D3557] p-6 text-white border-r border-white/10">
            <h2 className="text-2xl font-bold mb-6">Departments</h2>
            <ul className="space-y-4">
              <li className="bg-white/10 hover:bg-[#2E5A88] transition p-4 rounded-lg cursor-pointer">Sanitation</li>
              <li className="bg-white/10 hover:bg-[#2E5A88] transition p-4 rounded-lg cursor-pointer">Transport</li>
              <li className="bg-white/10 hover:bg-[#2E5A88] transition p-4 rounded-lg cursor-pointer">Electricity</li>
            </ul>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col h-[80vh]">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {staticMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[75%] px-5 py-3 rounded-xl shadow-md transition transform ${
                    msg.sender === 'You'
                      ? 'ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{msg.sender}</p>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center p-4 border-t border-white/10 bg-white/10">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="ml-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
