// --- 1. SETUP ---
// Import necessary libraries
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
// Create the app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

// --- 2. GAME STATE ---
// This is the "single source of truth" for your game's shared data.
const gameState = {
  protagonist: "human"
  // You could add more shared variables here later, e.g.:
  // score: 0,
  // worldEvent: "none"
};

io.on('connection', (socket) => {
    console.log('A user connected. Sending them the current state.');

    // --- THIS IS THE NEW LINE ---
    // Immediately send the current gameState to the newly connected client.
    socket.emit('stateUpdated', gameState);
    // ----------------------------

    socket.on('updateState', (newState) => {
        gameState = { ...gameState, ...newState };
        console.log('State updated:', gameState);
        io.emit('stateUpdated', gameState); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// --- 4. START THE SERVER ---
// Use the port provided by Render, or 3000 for local testing.
const PORT = process.env.PORT || 3356;
server.listen(PORT, () => { console.log(`Server running on port ${PORT}`);
console.log(`Server is running and listening on port ${PORT}`);
});