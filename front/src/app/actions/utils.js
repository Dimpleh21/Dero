"use server";

const API_BASE_URL = "http://localhost:8000/api/user";

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to sign you in");
    }

    const data = await res.json();
    console.log("Signed In:", data);
    return data;
  } catch (err) {
    console.error("Error registering:", err.message);
    return null;
  }
};

export const createSession = async (sessionData) => {
  try {
    const res = await fetch(`http://localhost:8000/api/session/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create session");
    }

    const data = await res.json();
    sessionId = data.sessionId;
    console.log("Session Created:", data);
    return data;
  } catch (err) {
    console.error("Error creating session:", err.message);
    return null;
  }
};
