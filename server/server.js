/**
 * map users. Contains elements of the form:
 *  {userName : "", password : ""}
 */
const users = {};

/**
 * map of rooms. Contains elements of the form:
 *  { roomName : "", description : "", maxPeople : 99,
 *      private : true|false, creator : "",
 *      users : [
 *          <username> : {userName : ""}, ...
 *      ]
 *  }
 */
const rooms = {};

//create http-server, wrapped in socket.io
const io = require('socket.io')(require('http')
    .createServer(
        function(){}
    ).listen(8000)
);