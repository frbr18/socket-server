const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

let users = [];
let messages = [];
let index = 0;

app.get("/", (req, res) => {
    res.send("It works");
});

io.on('connection', socket => {
    socket.emit('loggedIn', {
        users: users.map(user => user.username),
        messages: messages
    });

    socket.on('newuser', username => {
        console.log(`${username} har anslutit.`);
        socket.username = username;
        users.push(socket);
        io.emit('userOnline', socket.username);
    });

    socket.on('msg', msg => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg
        }

        messages.push(message);

        io.emit('msg', message);
        index++;
    });

    //Disconnect
    socket.on("disconnet", () => {
        console.log(`${socket.username} har lämnat chatten.`);
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
});

http.listen(8334, () => {
    console.log("Server listening on port 8334");
});