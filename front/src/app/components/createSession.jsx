"use client";
import React, { useState } from "react";
//groupId, title, description, scheduledAt, durationMinutes
export default function CreateSession() {
  const [sessionId, setSessionId] = useState("");
  async function handleCreateSession() {
    try {
      const res = await fetch(`http://localhost:8000/api/session/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create session");
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      console.log("Session Created:", data);
    } catch (err) {
      console.error("Error creating session:", err.message);
    }
  }

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div>To create the session, copy the link below</div>
        <div className="font-bold">Here is your Id</div>
        <div>
          <button
            onClick={handleCreateSession}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Session
          </button>
        </div>
        <div>{sessionId}</div>
      </div>
    </div>
  );
}
