"use client";
import React, { useState, useEffect } from "react";

export default function JoinSession({ show, onJoin, onClose }) {
  const [sessionId, setSessionId] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Reset inputs when overlay is shown
  useEffect(() => {
    if (show) {
      setSessionId("");
      setDisplayName("");
    }
  }, [show]);

  if (!show) return null; // Render nothing if not shown

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sessionId.trim() && displayName.trim()) {
      onJoin({ sessionId: sessionId.trim(), displayName: displayName.trim() });
      if (onClose) onClose();
    } else {
      alert("Please enter both session ID and display name.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2>Join a Session</h2>

        <label>
          Session ID:
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          Display Name:
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: 10,
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Join
        </button>
      </form>
    </div>
  );
}
