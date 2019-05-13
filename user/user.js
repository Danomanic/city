var tile = require('../tile');

function connect(socket) {
  try {
    users[socket.id] = { id: socket.id, money: 100, colour: Math.floor(Math.random()*16777215).toString(16) };
    io.emit('user_connect', { id: socket.id, connected: Object.keys(users).length });
    log.info("User Connected.", socket.id);
  }
  catch(e) {
    log.error(e, socket.id);
  }
}

function disconnect(socket) {
  try {
    delete users[socket.id];
    io.emit('user_disconnect', { id: socket.id, connected: Object.keys(users).length });
    log.info("User Disconnected", socket.id);
  }
  catch(e) {
    log.error(e, socket.id);
  }
}

function click(socket, data) {
  if(users[socket.id].money >= 10) {
    users[socket.id].money = users[socket.id].money - 10;
    tile.obtain(data.tile, users[socket.id]);
  }
}

module.exports = {
  connect,
  disconnect,
  click
}
