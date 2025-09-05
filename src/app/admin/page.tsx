"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SAMPLE_IMAGES = [
  "/slides/image.png",
  "/slides/image (1).png",
  "/slides/image (2).png",
  "/slides/image (3).png",
  "/slides/image (4).png",
];

export default function AdminPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("imageChanged", (imageUrl: string) => {
      setCurrentImage(imageUrl);
    });

    return () => {
      newSocket.close();
    };
  }, []);

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
