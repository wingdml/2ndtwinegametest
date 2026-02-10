// --- server.js (FINAL, ROBUST VERSION) ---

// Import required packages
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

// Setup server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from anywhere
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// --- GLOBAL GAME STATE ---
// This is the single source of truth for the entire game.
let gameState = {
    protagonist: "human" // The default value when the server first starts.
};

// --- REAL-TIME LOGIC ---
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // 1. WELCOME NEW PLAYER: Immediately send them the current state.
    socket.emit('stateUpdated', gameState);
    console.log(`Sent initial state to ${socket.id}:`, gameState);

    // 2. LISTEN FOR UPDATES: This is the critical part.
    socket.on('updateState', (data) => {
        console.log(`Received update from ${socket.id}:`, data);

        // --- THE FIX IS HERE ---
        // We will now safely and explicitly update the state.
        // This prevents crashes if the 'data' object is weird.
        if (data && data.protagonist) {
            gameState.protagonist = data.protagonist;

            // 3. BROADCAST CHANGE: Announce the new, updated state to EVERYONE.
            console.log('Broadcasting new global state:', gameState);
            io.emit('stateUpdated', gameState);
        } else {
            console.log('Received malformed update. Ignoring.');
        }
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

// Serve the static Twine game file
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
server.listen(PORT, () => {
    console.log(`Server is running. Initial state:`, gameState);
    console.log(`Listening on *:${PORT}`);
});