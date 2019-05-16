const pjson = require('./package.json');
global.pjson = pjson;

const cjson = require('./credentials.json');
global.cjson = cjson;
global.cjson.mongo.url = process.env.MONGO_URL;

const { DB } = require('./lib/DB.js');
global.DB = DB;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
global.io = io;

const user = require('./user');

const log = require('./utils/log.js');
global.log = log;

const port = process.env.PORT || 5000

var users = {};
global.users = users;

var tiles = {};
global.tiles = tiles;

DB.connectToMongo();

io.on('connection', function(socket){
  user.connect(socket);

  socket.on('user_click', function(data){
    user.click(socket, data);
  });

  socket.on('disconnect', function(){
    user.disconnect(socket);
  });
});

const tick = () => {
  try {
    for(var key in users) {
      users[key].money++;
    }
    io.emit('tick', { users : users });
  }
  catch {
    log.info("Unable to tick.");
  }
}


http.listen(port, function(){
  log.info('Listening on *:'+port);
});

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


var intervalID = setInterval(tick, 1000);

for (var x = 1; x < 21; x++) {
  for (var y = 1; y < 21; y++) {
    var tile;
    var id = "tile_"+x+"_"+y;
    tile = { id: id, user: { id: "", colour: "76a21e"} }
    tiles[id] = tile;
  }
}
