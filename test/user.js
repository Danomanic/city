var expect = require('chai').expect;
var user = require('../user');

var log = require('../utils/log.js');
global.log = log;

var users = {};
global.users = users;

describe('user.connect()', function () {
  it('should append the users array with new user', function () {

    // 1. ARRANGE
    var socket = { id: "test" };

    // 2. ACT
    user.connect(socket);

    // 3. ASSERT
    expect(users).to.have.keys([socket.id]);

  });
});

describe('user.disconnect()', function () {
  it('should remove socket from users array', function () {
    var socket = { id: "test" };
    user.disconnect(socket);
    expect(users).to.not.have.keys([socket.id]);
  });
});
