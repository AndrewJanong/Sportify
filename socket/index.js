require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const http = require("http").Server(app)
const io = require("socket.io")(http, {
    cors: {
        origin: process.env.CLIENT_URL
    }
})

const port = process.env.PORT || 8900;

app.use(cors());

// const io = require("socket.io")(8900, {
//     cors: {
//         origin: process.env.CLIENT_URL
//     }
// })

let users = [];

const addUser = (username, socketId) => {
    // !users.some((user) => user.username === username) &&
    // users.push({ username, socketId });

    if (users.some((user) => user.username === username)) {
        users = users.filter((user) => user.username !== username);
    }

    users.push({ username, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
    return users.find((user) => user.username === username);
};

io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (username) => {
        addUser(username, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({message, groupMembers}) => {
        console.log(groupMembers);
        groupMembers.forEach((username) => {
            console.log(username);
            const user = getUser(username);
            if (user) io.to(user.socketId).emit("getMessage", message);
        })
        
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

http.listen(port, () => {
    console.log(`App listening on port ${port}`)
})