function obtain(tile, user) {
  tiles[tile].user = user.id;
  log.info(tiles);
}

module.exports = {
  obtain
}
