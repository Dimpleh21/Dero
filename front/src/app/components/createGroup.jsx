"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGroupForm({ token }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token
        },
        body: JSON.stringify({
          name,
          description,
          tags: tags.split(",").map((t) => t.trim()),
          privacy,
          avatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create group");
      } else {
        console.log("Group created:", data.group);
        router.push("/groups"); // redirect to groups page
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating group");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Group</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
        <input
          type="text"
          placeholder="Avatar URL (optional)"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}
