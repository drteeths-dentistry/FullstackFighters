const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 7777;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const state = {};
const clientRooms = {};

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

io.on('connection', (socket) => {
  console.log('A user just connected.');

  socket.on('startGame', () => {
    let roomName = makeid(5);
    clientRooms[socket.id] = roomName;
    socket.join(roomName);
    io.to(socket.id).emit('startGame', roomName);
  });

  socket.on('joinGame', (roomName) => {
    console.log(clientRooms);
    clientRooms[socket.id] = roomName.rc;
    socket.join(roomName.rc);
    console.log(clientRooms);
  });

  socket.on('kingSelect', () => {
    io.emit('kingSelect');
  });

  socket.on('ghostSelect', () => {
    io.emit('ghostSelect');
  });

  socket.on('ready', () => {
    io.emit('ready');
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

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// function handleNewGame() {
//   let roomName = makeid(5);
//   clientRooms[socket.id] = roomName;
//   socket.emit('gameCode', roomName);

//   state[roomName] = initGame();

//   socket.join(roomName);
//   socket.number = 1;
//   socket.emit('init', 1);
// }

// function handleJoinGame(roomName) {
//   const room = io.sockets.adapter.rooms[roomName];

//   let allUsers;
//   if (room) {
//     allUsers = room.sockets;
//   }

//   let numClients = 0;
//   if (allUsers) {
//     numClients = Object.keys(allUsers).length;
//   }

//   if (numClients === 0) {
//     client.emit('unknownCode');
//     return;
//   } else if (numClients > 1) {
//     client.emit('tooManyPlayers');
//     return;
//   }

//   clientRooms[client.id] = roomName;

//   client.join(roomName);
//   client.number = 2;
//   client.emit('init', 2);

//   startGameInterval(roomName);
// }
