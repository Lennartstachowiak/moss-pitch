import { Server as SocketIOServer } from 'socket.io';
import { storage } from './storage';

export function initializeWebSocket(server: any) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current state to newly connected client
    socket.emit('imageChanged', storage.getCurrentImage());

    socket.on('changeImage', (imageUrl: string) => {
      storage.setCurrentImage(imageUrl);
      // Broadcast to all connected clients
      io.emit('imageChanged', imageUrl);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}