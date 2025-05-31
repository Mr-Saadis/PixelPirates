"use client";

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

const ChatWindowAdminOfficial = ({ userId, userRole }) => {
  const [users, setUsers] = useState([]); // officials for admin, or admin for official
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  console.log("Messages", messages);
  console.log("Messa", message);

  console.log("userId:", userId);
  console.log("selectedUser.id:", selectedUser?.id);

  useEffect(() => {
    const fetchUsers = async () => {
      if (userRole === "admin") {
        const { data } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("role", "official");
        setUsers(data || []);
      } else if (userRole === "official") {
        const { data } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("role", "admin")
          .single();
        setUsers(data ? [data] : []);
        setSelectedUser(data); // auto-select admin
      }
    };
    fetchUsers();
  }, [userRole]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`) // get all my messages
      .order("created_at");

    if (error) {
      console.error("Message fetch error:", error);
      return;
    }

    const filtered = data.filter(
      (msg) =>
        (msg.sender_id === selectedUser.id && msg.receiver_id === userId) ||
        (msg.receiver_id === selectedUser.id && msg.sender_id === userId)
    );

    console.log("Fetched from Supabase:", data);
    console.log("Filtered messages:", filtered);

    setMessages(filtered);
    scrollToBottom();
  };
  

  useEffect(() => {
    if (!selectedUser) return;
    // const fetchMessages = async () => {
    //   const { data } = await supabase
    //     .from("message")
    //     .select("*, sender:profiles(name)")
    //     .or(
    //       `and(sender_id.eq.${userId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${userId})`
    //     )
    //     .order("created_at");
    //   setMessages(data || []);
    //   scrollToBottom();
    // };

    fetchMessages();

    const channel = supabase
      .channel("admin-official-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === userId && msg.receiver_id === selectedUser.id) ||
            (msg.receiver_id === userId && msg.sender_id === selectedUser.id)
          ) {
            setMessages((prev) => [...prev, msg]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [selectedUser]);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;
    await supabase.from("message").insert([
      {
        sender_id: userId,
        receiver_id: selectedUser.id,
        content: message,
      },
    ]);
    setMessage("");
    fetchMessages();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D3557] via-[#2E5A88] to-[#457B9D] p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-3">
          {/* Sidebar */}
          <div className="col-span-1 bg-[#1D3557] p-6 text-white border-r border-white/10">
            <h2 className="text-2xl font-bold mb-6">
              {userRole === "admin" ? "Officials" : "Admin"}
            </h2>
            <ul className="space-y-4">
              {users.map((u) => (
                <li
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedUser?.id === u.id
                      ? "bg-[#2E5A88]"
                      : "bg-white/10 hover:bg-[#2E5A88]"
                  }`}
                >
                  {u.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="col-span-2 flex flex-col h-[80vh]">
            <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[75%] px-5 py-3 rounded-xl shadow-md transition transform ${
                    msg.sender_id === userId
                      ? "ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.sender?.name || "User"}
                  </p>
                  <p className="mb-1">{msg.content}</p>
                  <p className="text-xs text-gray-300 text-right">
                    {format(new Date(msg.created_at), "hh:mm a")}
                  </p>
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>

            {/* Message Input */}
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

export default ChatWindowAdminOfficial;
