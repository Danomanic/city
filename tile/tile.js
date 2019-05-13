function obtain(tile, user) {
  tiles[tile].user = user;
  log.info(tiles);
}

module.exports = {
  obtain
}
