const env = require('dotenv').config();
const cjson = require('./credentials.json');
const pjson = require('./package.json');
const { DB } = require('./lib/DB.js');
const log = require('./utils/log.js');

global.pjson = pjson;
global.cjson = cjson;
global.cjson.mongo.url = process.env.MONGO_URL;
global.DB = DB;
global.log = log;

DB.connectToMongo((response) => {

  DB.db.collection('tiles').deleteMany({});
  let tiles = [];
  for (x = 0; x < 20; x++) {
    for (y = 0; y < 20; y++) {
      tiles.push({ id: `tile_${x}_${y}`, user: {} });
    }
  }

  DB.db.collection('tiles').insertMany(tiles);
});
