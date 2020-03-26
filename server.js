const express = require('express');
const server = express();
const session = require("express-session");
const cors = require('cors')
const helmet = require('helmet')

const usersRouter = require('./data/users/user-router.js')


const sessionConfig = {
    name: "this is a secret",
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
server.use(cors());
server.use(helmet());
server.use('/api/users', usersRouter);


server.get('/', (req, res) => {
    res.send(`<h2>Server is running</h2>`);
});


function checkRole(role) {
    return (req, res, next) => {
        if (
            req.decodedToken &&
            req.decodedToken.role &&
            req.decodedToken.role.toLowerCase() === role
        ) {
            next();
        } else {
            res.status(403).json({ you: "Shall not pass!" });
        }
    };
}

module.exports = server;