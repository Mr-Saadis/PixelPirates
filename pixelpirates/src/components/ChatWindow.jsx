"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

const ChatWindow = ({ userId }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("depmartment").select("*");
      if (error) console.error("Error fetching departments:", error);
      else setDepartments(data || []);
    };

    fetchDepartments();
  }, []);

  const fetchMessages = async () => {
    if (!selectedDept) return;
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .eq("department_id", selectedDept.id)
      .order("created_at");

    if (error) console.error("Message fetch error:", error);
    else setMessages(data || []);
  };

  useEffect(() => {
    if (selectedDept) fetchMessages();
  }, [selectedDept]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedDept) return;

    const { data: officials } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "official")
      .eq("department_id", selectedDept.id);

    if (officials?.length) {
      const messagesToSend = officials.map((official) => ({
        sender_id: userId,
        receiver_id: official.id,
        content: message,
        department_id: selectedDept.id,
      }));

      const { error } = await supabase.from("message").insert(messagesToSend);
      if (error) console.error("Send error:", error);
      else {
        setMessage("");
        fetchMessages();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gradient-to-br from-[#1D3557] via-[#2E5A88] to-[#457B9D] backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="grid grid-cols-3">
          {/* Sidebar */}
          <div className="col-span-1 bg-[#1D3557] p-6 text-white border-r border-white/10">
            <h2 className="text-2xl font-bold mb-6">Departments</h2>
            <ul className="space-y-4">
              {departments.map((dept, i) => (
                <li
                  key={i}
                  onClick={() => setSelectedDept(dept)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedDept?.id === dept.id
                      ? "bg-[#2E5A88]"
                      : "bg-white/10 hover:bg-[#2E5A88]"
                  }`}
                >
                  {dept.department_name}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col h-[80vh]">
            <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] px-5 py-3 rounded-xl shadow-md transition transform ${
                    msg.sender_id === userId
                      ? "ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.sender_id === userId ? "You" : "Official"}
                  </p>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>

            <form
              onSubmit={sendMessage}
              className="flex items-center p-4 border-t border-white/10 bg-white/10"
            >
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
