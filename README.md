# Presentation System

A real-time presentation system built with Next.js and Socket.IO that allows an admin to control what images are displayed to viewers in real-time.

## Features

- **Admin Panel** (`/admin`): Control interface to select and display images
- **Viewer Page** (`/viewer`): Display page that shows the current image in fullscreen
- **Real-time Updates**: Uses WebSocket (Socket.IO) for instant synchronization
- **Simple Storage**: In-memory storage for the current presentation state
- **Sample Images**: Pre-loaded placeholder images for quick testing
- **Custom URLs**: Support for displaying images from any URL

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   - Home page: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Viewer: http://localhost:3000/viewer

## How to Use

### Admin Panel
1. Navigate to `/admin`
2. Choose from sample images or enter a custom image URL
3. Click on any image or "Show Image" button to display it to all viewers
4. Use "Clear Display" to remove the current image

### Viewer
1. Navigate to `/viewer`
2. The page will automatically display whatever the admin selects
3. Connection status is shown in the top-right corner
4. The page updates in real-time without needing to refresh

## Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Custom Express-like server with Socket.IO
- **Real-time Communication**: Socket.IO for WebSocket connections
- **Storage**: In-memory storage (resets on server restart)

## API Events

- `changeImage`: Sent by admin to change the displayed image
- `imageChanged`: Broadcast to all clients when image changes

## Production Deployment

For production, run:
```bash
npm run build
npm start
```

The system is designed to be simple and lightweight, perfect for presentations, digital signage, or remote teaching scenarios.
