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

app.use(express.static('./')); 

// --- 2. GAME STATE ---
// This is the "single source of truth" for your game's shared data.
const gameState = {
  protagonist: "human"
  // You could add more shared variables here later, e.g.:
  // score: 0,
  // worldEvent: "none"
};

io.on('connection', (socket) => {
    // Immediately send the current state to the new player
    socket.emit('stateUpdated', gameState); // Note the event name

    // Listens for 'updateState' with an OBJECT
    socket.on('updateState', (data) => {
        // Merge the new data into the master state
        Object.assign(gameState, data); 
        // Broadcast the FULL new state to EVERYONE
        io.emit('stateUpdated', gameState); 
        console.log('Broadcast new state to all players:', gameState);
    });
    socket.on('disconnect', () => {
    console.log(`A player disconnected: ${socket.id}`);
  });
});

// --- 4. START THE SERVER ---
// Use the port provided by Render, or 3000 for local testing.
const PORT = process.env.PORT || 3356;
server.listen(PORT, () => { console.log(`Server running on port ${PORT}`);
console.log(`Server is running and listening on port ${PORT}`);
});