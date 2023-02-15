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

io.on("connection", io => {
    console.log("Connection established with a client");

    io.on("validate", (inData, inCallback) => {

        const user = users[inData.userName];
        if (user) {
            if (user.password === inData.password) {
                inCallback({ status : "ok"});
            } else {
                inCallback({ status : "fail" });
            }
        } else {
            user[inData.userName] = inData;
            io.broadcast.emit("newUser", users);
            inCallback({ status : "created" });
        }

    });

}); //connection handler