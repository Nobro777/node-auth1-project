const express = require('express');
const server = express();
const session = require("express-session");

const usersRouter = require('./data/users/user-router.js')

const sessionConfig = {
    name: "tesstt",
    secret: "keep it secret, keep it safe!",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false, 
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
};

server.use(session(sessionConfig))
server.use(express.json());
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Server is running</h2>`);
});

module.exports = server;