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

  socket.on('keydown', (event) => {
    io.emit('keydown', event);
  });

  socket.on('keyup', (event) => {
    io.emit('keyup', event);
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
  });
});
