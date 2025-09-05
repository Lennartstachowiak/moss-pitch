"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SAMPLE_IMAGES = [
  "/slides/slide1.png",
  "/slides/slide2.png",
  "/slides/slide3.png",
  "/slides/slide4.png",
  "/slides/slide5.png",
  "/slides/company-values.png",
];

const ADMIN_PIN = "5412";

export default function AdminPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on("imageChanged", (imageUrl: string) => {
        setCurrentImage(imageUrl);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Invalid PIN. Please try again.");
      setPinInput("");
    }
  };

  const changeImage = (imageUrl: string) => {
    if (socket) {
      socket.emit("changeImage", imageUrl);
    }
  };

  const handleCustomImage = () => {
    if (customImageUrl.trim()) {
      changeImage(customImageUrl.trim());
      setCustomImageUrl("");
    }
  };

  // Show PIN entry form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Access
          </h1>
          <form onSubmit={handlePinSubmit}>
            <div className="mb-4">
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
                placeholder="••••"
                maxLength={4}
                autoFocus
              />
              {pinError && (
                <p className="mt-2 text-sm text-red-600">{pinError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Display</h2>
          {currentImage ? (
            <div className="flex flex-col items-center">
              <img
                src={currentImage}
                alt="Current presentation slide"
                className="max-w-full h-64 object-contain border rounded"
              />
              <p className="mt-2 text-sm text-gray-600">{currentImage}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No image selected</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sample Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SAMPLE_IMAGES.map((imageUrl, index) => (
              <div key={index} className="text-center">
                <img
                  src={imageUrl}
                  alt={`Sample slide ${index + 1}`}
                  className="w-full h-32 object-cover border rounded cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => changeImage(imageUrl)}
                />
                <button
                  onClick={() => changeImage(imageUrl)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                >
                  Show Slide {index + 1}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Image URL</h2>
          <div className="flex gap-2">
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCustomImage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Show Image
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => changeImage("")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear Display
          </button>
        </div>
      </div>
    </div>
  );
}
