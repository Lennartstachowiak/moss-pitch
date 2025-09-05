# Real-Time Presentation System

A real-time presentation system built with Next.js and Socket.IO that allows an admin to control what images are displayed to viewers in real-time with PIN protection.

## Features

- **🏠 Viewer Page** (`/`): Main presentation display that shows images in real-time
- **🔐 Admin Panel** (`/admin`): PIN-protected control interface (PIN: 5412)
- **⚡ Real-time Updates**: WebSocket synchronization for instant image changes
- **💾 In-Memory Storage**: Simple state management for current presentation
- **🖼️ Local Images**: Support for images in `public/slides/` folder
- **🌐 Custom URLs**: Display images from any external URL
- **🔒 Security**: PIN protection prevents unauthorized access to admin controls

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your presentation images:**
   ```bash
   # Place your images in the public/slides/ folder
   cp your-images/* public/slides/
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the system:**
   - **Presentation Display**: http://localhost:3000 (main viewer)
   - **Admin Control**: http://localhost:3000/admin (requires PIN: 5412)

## How It Works

### System Architecture

```
┌─────────────────┐    WebSocket     ┌─────────────────┐
│   Admin Panel   │ ◄──────────────► │   WebSocket     │
│   (PIN: 5412)   │                  │    Server       │
└─────────────────┘                  │   (Socket.IO)   │
                                     │                 │
┌─────────────────┐    WebSocket     │                 │
│  Viewer Pages   │ ◄──────────────► │                 │
│ (Multiple clients)                 │                 │
└─────────────────┘                  └─────────────────┘
                                             │
                                             ▼
                                     ┌─────────────────┐
                                     │  In-Memory      │
                                     │  Storage        │
                                     │ (currentImage)  │
                                     └─────────────────┘
```

### Data Flow

1. **Image Selection**: Admin selects an image in the admin panel
2. **WebSocket Emission**: Admin client emits `changeImage` event with image URL
3. **Server Storage**: Server stores the image URL in memory
4. **Broadcast**: Server broadcasts `imageChanged` event to all connected clients
5. **Real-time Update**: All viewer clients immediately display the new image

### Component Breakdown

#### 1. **Custom Server** (`server.js`)
- **Purpose**: Handles both Next.js routing and WebSocket connections
- **Technology**: Node.js with Socket.IO
- **Features**:
  - Serves Next.js application
  - Manages WebSocket connections
  - Maintains current image state in memory
  - Broadcasts image changes to all clients

```javascript
// Key server functionality
io.on('connection', (socket) => {
  // Send current image to new connections
  socket.emit('imageChanged', currentImage);
  
  // Handle admin image changes
  socket.on('changeImage', (imageUrl) => {
    currentImage = imageUrl; // Store in memory
    io.emit('imageChanged', imageUrl); // Broadcast to all
  });
});
```

#### 2. **Viewer Page** (`src/app/page.tsx`)
- **Purpose**: Main presentation display
- **Features**:
  - Real-time image display
  - Connection status indicator
  - Responsive image sizing (max-height: 80vh)
  - Automatic WebSocket reconnection

```javascript
// Key viewer functionality
useEffect(() => {
  const socket = io();
  
  socket.on('imageChanged', (imageUrl) => {
    setCurrentImage(imageUrl); // Update display
  });
  
  socket.on('connect', () => {
    setIsConnected(true); // Show connection status
  });
}, []);
```

#### 3. **Admin Panel** (`src/app/admin/page.tsx`)
- **Purpose**: PIN-protected control interface
- **Security**: Requires PIN 5412 for access
- **Features**:
  - PIN authentication form
  - Image thumbnail preview
  - Local image management
  - Custom URL input
  - Clear display functionality

```javascript
// Key admin functionality
const handlePinSubmit = (e) => {
  if (pinInput === ADMIN_PIN) {
    setIsAuthenticated(true); // Access granted
    // Initialize WebSocket connection
  }
};

const changeImage = (imageUrl) => {
  socket.emit('changeImage', imageUrl); // Send to server
};
```

### Storage System

The system uses **in-memory storage** for simplicity:

```javascript
let currentImage = null; // Global server state

// When admin changes image
socket.on('changeImage', (imageUrl) => {
  currentImage = imageUrl; // Update server memory
  io.emit('imageChanged', imageUrl); // Notify all clients
});

// When new client connects
socket.emit('imageChanged', currentImage); // Send current state
```

**Storage Characteristics:**
- ✅ **Fast**: Instant read/write operations
- ✅ **Simple**: No database setup required
- ✅ **Lightweight**: Minimal memory footprint
- ⚠️ **Temporary**: State resets on server restart
- ⚠️ **Single Instance**: Not suitable for multi-server deployments

### WebSocket Events

| Event | Direction | Purpose | Data |
|-------|-----------|---------|------|
| `connect` | Client → Server | Client connection established | - |
| `disconnect` | Client → Server | Client disconnected | - |
| `changeImage` | Admin → Server | Admin requests image change | `imageUrl: string` |
| `imageChanged` | Server → All Clients | Notify image has changed | `imageUrl: string` |

### Security Features

1. **PIN Protection**: Admin panel requires PIN 5412
2. **Input Validation**: PIN input is sanitized and validated
3. **Error Handling**: Invalid PIN attempts show error messages
4. **Session Management**: Authentication state managed client-side
5. **CORS Configuration**: WebSocket server configured for safe cross-origin requests

## File Structure

```
moss-pitch/
├── server.js                 # Custom server with WebSocket support
├── public/slides/            # Presentation images directory
│   ├── intro-slide.jpeg
│   ├── slide1.png
│   └── ...
├── src/app/
│   ├── page.tsx             # Main viewer page (index)
│   └── admin/
│       └── page.tsx         # PIN-protected admin panel
├── lib/
│   ├── storage.ts           # Storage utilities (unused in current setup)
│   └── websocket.ts         # WebSocket utilities (unused in current setup)
├── Dockerfile               # Docker containerization
├── docker-compose.yml       # Docker Compose configuration
└── package.json            # Dependencies and scripts
```

## Usage Scenarios

### 1. **Live Presentations**
- Speaker controls slides from admin panel
- Audience views presentation on main URL
- Real-time synchronization ensures everyone sees the same content

### 2. **Digital Signage**
- Content manager updates displayed images remotely
- Multiple displays show synchronized content
- PIN protection prevents unauthorized changes

### 3. **Remote Teaching**
- Teacher controls visual content from admin interface
- Students access viewer URL for synchronized learning materials
- No software installation required for students

## Deployment Options

### Docker Deployment (Recommended for Render)

1. **Build and run with Docker:**
   ```bash
   docker build -t presentation-system .
   docker run -p 3000:3000 presentation-system
   ```

2. **Or use Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **For Render.com deployment:**
   - Connect your GitHub repository to Render
   - Select "Docker" as the environment
   - Render will automatically detect and use the Dockerfile
   - Set the port to `3000`
   - Your app will be available at your Render URL

### Traditional Node.js Deployment

For production without Docker:
```bash
npm run build
npm start
```

### Adding Your Own Images

1. Place your presentation images in the `public/slides/` folder
2. The admin panel will automatically use images from this directory
3. Supported formats: PNG, JPG, JPEG, GIF, WebP

### Environment Variables

- `NODE_ENV`: Set to `production` for production builds
- `PORT`: Server port (defaults to 3000)

The system is designed to be simple and lightweight, perfect for presentations, digital signage, or remote teaching scenarios.
