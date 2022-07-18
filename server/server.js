const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 7777;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const clientRooms = {};

const findRoom = (rc) => {
  let output = [];
  for (let socketId in clientRooms) {
    let roomName = clientRooms[socketId];
    if (roomName === rc) {
      output.push(socketId);
    }
  }
  return output;
};

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
    clientRooms[socket.id] = roomName.rc;
    socket.join(roomName.rc);
    io.to(socket.id).emit('joinGame', roomName.rc);
  });

  socket.on('kingSelect', () => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('kingSelect');
    });
  });

  socket.on('ghostSelect', () => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('ghostSelect');
    });
  });

  socket.on('ready', () => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('ready');
    });
  });

  socket.on('replay', () => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('replay');
    });
  });

  socket.on('keydown', (data) => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('keydown', data);
    });
  });

  socket.on('keyup', (data) => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('keyup', data);
    });
  });

  socket.on('animate', () => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('animate');
    });
  });
  socket.on('tensorKing', (data) => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('tensorKing', data);
    });
  });
  socket.on('tensorGhost', (data) => {
    let rc = clientRooms[socket.id];
    let rooms = findRoom(rc);
    rooms.forEach((room) => {
      io.to(room).emit('tensorGhost', data);
    });
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
