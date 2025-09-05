"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Link from "next/link";

export default function Home() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("imageChanged", (imageUrl: string) => {
      setCurrentImage(imageUrl);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Connection Status - Top Right */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 sm:gap-2">
        <div
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-white text-xs sm:text-sm">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Main Content Area - Full Screen */}
      <div className="w-full h-screen flex items-center justify-center">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Presentation slide"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center px-4">
            <div className="text-4xl sm:text-6xl text-gray-600 mb-2 sm:mb-4">
              📺
            </div>
            <p className="text-white text-lg sm:text-xl">
              Waiting for presentation to start...
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              The presenter will control what is displayed here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
