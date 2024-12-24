const io = require('socket.io-client');
const socket = io('http://localhost:3000');

// Socket event listeners
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('message', (message) => {
    console.log('Message from server:', message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
