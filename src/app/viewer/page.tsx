'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ViewerPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('imageChanged', (imageUrl: string) => {
      setCurrentImage(imageUrl);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-white text-sm">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="w-full h-full flex items-center justify-center p-8">
        {currentImage ? (
          <img 
            src={currentImage} 
            alt="Presentation slide" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center">
            <div className="text-6xl text-gray-600 mb-4">📺</div>
            <p className="text-white text-xl">Waiting for presentation to start...</p>
            <p className="text-gray-400 text-sm mt-2">
              The admin will control what is displayed here
            </p>
          </div>
        )}
      </div>

      {currentImage && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-50 text-white text-sm p-2 rounded text-center">
            Currently displaying: {currentImage.length > 60 ? currentImage.substring(0, 60) + '...' : currentImage}
          </div>
        </div>
      )}
    </div>
  );
}