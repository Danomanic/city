const { MongoClient } = require('mongodb');

class DB {
  static connectToMongo(callback) {
    if (this.db) return Promise.resolve(this.db);
    return MongoClient.connect(cjson.mongo.url, cjson.mongo.options, (err, db) => {
      if (err) throw err;
      this.db = db.db(cjson.mongo.db);
      log.info("Connected to Database");
      callback(true);
    });
  }
}

DB.db = null;

module.exports = { DB };
