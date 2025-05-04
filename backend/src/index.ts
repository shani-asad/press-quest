// server.js (Node.js + Express + Socket.IO)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const TARGET = 20;
let counter = 0;
let players = new Set();
let gameOver = false;

app.use(express.static('public'));

io.on('connection', (socket: any) => {
  console.log(`Player connected: ${socket.id}`);
  players.add(socket.id);

  socket.emit('counterUpdate', counter);

  socket.on('step', () => {
    if (gameOver) return;
    counter++;
    io.emit('counterUpdate', counter);

    if (counter >= TARGET) {
      gameOver = true;
      io.emit('gameOver', socket.id);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    players.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
