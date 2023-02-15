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

    /** show users handler */
    io.on(" listUsers", (inData, inCallback) => {
        inCallback({users});
    });
    
    /** create room handler */
    io.on("create", (inData, inCallback) => {

        if (rooms[inData.roomName]) {
            inCallback({ status : "exists" });
        } else {
            inData.users = {};
            rooms[inData.roomName] = inData;
            io.broadcast.emit("created", rooms);
            inCallback({ status : "created", rooms : rooms });
        }
    });

    /** show rooms handler */
    io.on("listRooms", (inData, inCallback) => {
        inCallback(rooms);
    });

    /** join in room handler */
    io.on("join", (inData, inCallback) => {
        const room = rooms[inData.roomName];
        if (Object.keys(room.users).length >= room.maxPeople) {
            inCallback({ status : "full" });
        } else {
            room.users[inData.userName] = users[inData.userName];
            io.broadcast.emit("joined", room);
            inCallback({ status : "joined", room : room });
        }
    });
    
    /**
     * invate users handler 
     * the message is sent to all users,
     * and those whose name is specified in inData respond
    */
    io.on("invate", (inData, inCallback) => {
        io.broadcast.emit("invated", inData);
        inCallback({ status : "ok" });
    });

}); //connection handler