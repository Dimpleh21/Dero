// components/Navbar.js
"use client";
import { useRouter } from "next/navigation";
import JoinSession from "./joinSession";
import { useState } from "react";
export default function Navbar() {
  const router = useRouter();
  const [showJoinSession, setShowJoinSession] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-1/6 w-full z-50 bg-transparent backdrop-filter backdrop-blur-xs`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 mt-8 justify-center">
        <div className="flex items-center h-12 w-[800px] bg-blue-300/30 border-2 border-white/10 rounded-3xl shadow-md p-6 py-6 justify-between">
          <div className="flex-shrink-0 text-white font-bold text-4xl font-dancing ml-3">
            Dero
          </div>
          <div className="flex gap-10">
            <button
              className="text-black font-raleway-200 text-lg cursor-pointer"
              onClick={() => {
                router.push("/createGroup");
              }}
            >
              Create group
            </button>
            <button
              className="text-black font-raleway-200 text-lg cursor-pointer"
              onClick={() => {
                router.push("/canvas");
              }}
            >
              Scribble
            </button>
            <button
              className="text-black font-raleway-200 text-lg cursor-pointer"
              onClick={() => {
                setShowJoinSession(true);
              }}
            >
              Join session
            </button>
            <button
              className="text-black font-raleway-200 text-lg cursor-pointer"
              onClick={() => {
                router.push("/createSession");
              }}
            >
              Create session
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
