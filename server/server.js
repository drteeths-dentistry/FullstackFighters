const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 7777;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

io.on('connection', (socket) => {
  console.log('A user just connected.');

  socket.on('startGame', () => {
    io.emit('startGame');
  });

  socket.on('select', () => {
    io.emit('select');
  });

  socket.on('replay', () => {
    io.emit('replay');
  });

  socket.on('keydown', (data) => {
    io.emit('keydown', data);
  });

  socket.on('keyup', (data) => {
    io.emit('keyup', data);
  });

  socket.on('animate', () => {
    io.emit('animate');
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
  });
});
