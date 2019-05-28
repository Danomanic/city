function obtain(tile, user) {
  try {
    DB.db.collection('tiles').updateOne({ id: tile }, { $set: { user } }, { upsert: true }, (err, res) => {
      if (err) throw err;
      tiles[tile].user = user;
    });
  } catch (e) {
    log.error(e, socket.id);
  }
}

module.exports = {
  obtain,
};
