const express = require("express");
const app = express();
const cors = require("cors");

const http = require("http").Server(app);
const io = require("socket.io")(http);

const bodyParser = require("body-parser");

//routers
const msgApi = require("./routes/msg-api");

let users = [];
let index = 0;

app.use(cors());
app.options('*', cors());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/msg', msgApi);
io.origins(['https://me-client.frbr18-jsramverk.me:443/']);

io.on('connection', socket => {
    let messages = [];
    socket.emit('loggedIn', {
        users: users.map(user => user.username),
        messages: messages
    });

    socket.on('newuser', username => {
        console.log(`${username} har anslutit.`);
        socket.username = username;
        socket.messages = [];
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

http.listen(8335, () => {
    console.log("Server listening on port 8334");
});