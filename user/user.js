const tile = require('../tile');

function connect(socket) {
  try {
    DB.db.collection('users').insertOne({ id: socket.id }, () => {
      users[socket.id] = { id: socket.id, money: 1000, colour: Math.floor(Math.random() * 16777215).toString(16) };
      io.emit('user_connect', { id: socket.id, connected: Object.keys(users).length });

      DB.db.collection('tiles').find().sort({ id: 1 }).toArray((err, result) => {
        socket.emit('welcome', { tiles: result, version: pjson.version });
      });
      log.info('User Connected', socket.id);
    });
  } catch (e) {
    log.error(e, socket.id);
  }
}

function disconnect(socket) {
  try {
    DB.db.collection('users').deleteOne({ id: socket.id }, () => {
      delete users[socket.id];
      io.emit('user_disconnect', { id: socket.id, connected: Object.keys(users).length });
      log.info('User Disconnected', socket.id);
    });
  } catch (e) {
    log.error(e, socket.id);
  }
}

function click(socket, data) {
  if (users[socket.id].money >= 10) {
    if (tiles[data.tile].user.id !== users[socket.id].id) {
      const money = users[socket.id].money - 10;
      users[socket.id].money = money;
      tile.obtain(data.tile, users[socket.id]);
      io.emit('tile', { id: data.tile, user: users[socket.id] });
    } else {
      socket.emit('user_error', { message: 'Tile already taken.' });
    }
  } else {
    socket.emit('user_error', { message: 'Not enough money!' });
  }
}

module.exports = {
  connect,
  disconnect,
  click,
};
