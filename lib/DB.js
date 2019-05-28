const { MongoClient } = require('mongodb');

class DB {
  static connectToMongo() {
    if (this.db) return Promise.resolve(this.db);
    return MongoClient.connect(cjson.mongo.url, cjson.mongo.options, (err, db) => {
      if (err) throw err;
      this.db = db.db(cjson.mongo.db);
    });
  }
}

DB.db = null;

module.exports = { DB };
