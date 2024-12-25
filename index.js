// Import required modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid"); // For generating random room IDs

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for production)
  },
});

// Middleware to parse JSON
app.use(express.json());

// Store active rooms
const rooms = new Set();

// Endpoint to create a new room
app.post("/create-room", (req, res) => {
  const roomId = uuidv4(); // Generate a random room ID
  rooms.add(roomId);
  res.json({ roomId });
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room
  socket.on("join-room", (roomId) => {
    if (rooms.has(roomId)) {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.emit("room-joined", { success: true });
    } else {
      socket.emit("room-joined", { success: false, message: "Room not found" });
    }
  });

  // Handle MIDI note transmission
  socket.on("midi-note", ({ roomId, note }) => {
    if (rooms.has(roomId)) {
      socket.to(roomId).emit("midi-note", { note, from: socket.id });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
