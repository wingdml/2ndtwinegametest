const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));

const globalState = { Protagonist: "human" };

io.on('connection', (socket) => {
    console.log('A new player connected.');
    socket.emit('loadState', globalState);
    socket.on('updateProtagonist', (newValue) => {
        console.log(`Update received. Changing Protagonist to "${newValue}".`);
        globalState.Protagonist = newValue;
        io.emit('loadState', globalState);
    });
    socket.on('disconnect', () => { console.log('A player disconnected.'); });
});

const PORT = process.env.PORT || 3356;
server.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });