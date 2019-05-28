const env = require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { DB } = require('./lib/DB.js');
const cjson = require('./credentials.json');
const pjson = require('./package.json');
const user = require('./user');
const log = require('./utils/log.js');

global.pjson = pjson;
global.io = io;
global.cjson = cjson;
global.cjson.mongo.url = process.env.MONGO_URL;
global.DB = DB;
global.log = log;

const port = process.env.PORT || 5000;

const users = {};
global.users = users;

const tiles = {};
global.tiles = tiles;

DB.connectToMongo((response) => {
  DB.db.collection('tiles').find().sort({ id: 1 }).toArray((err, result) => {
    for (let x = 0; x < result.length; x += 1) {
      tiles[result[x].id] = result[x];
    }
  });
});

io.on('connection', (socket) => {
  user.connect(socket);

  socket.on('user_click', (data) => {
    user.click(socket, data);
  });

  socket.on('disconnect', () => {
    user.disconnect(socket);
  });
});

const tick = () => {
  try {
    Object.keys(users).forEach((key) => {
      users[key].money += 1;
    });
    io.emit('tick', { users });
  } catch (err) {
    log.info('Unable to tick.');
  }
};


http.listen(port, () => {
  log.info(`Listening on *:${port}`);
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

setInterval(tick, 1000);
