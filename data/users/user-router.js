const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const Users = require("./user-model.js");

const secrets = require('../../config/secrets.js');
const restricted = require('../../auth/restricted-middleware.js');




router.get('/', restricted, (req, res) => {

    if (req.session && req.session.user){
        Users.find().then(user => {
            res.status(200).json(user);
        }).catch(err => {
            res.status(500).json({
                errorMessage:'500 error',
                err
            })
        })
    }
    else {
        res.status(403).json({
            message: "'You shall not pass!"
        })
    }
}
);

router.post('/register', (req, res) => {
    const usersInfo = req.body;
    const hash = bcrypt.hashSync(usersInfo.password, 8);
    usersInfo.password = hash;

    Users.insert(usersInfo).then(user => {
        res.status(201).json(user);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            errorMessage:'Post request failed'
        })
    })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {

                const token = generateToken(user);
                req.session.user = user;

                res.status(200).json({
                    message:'Log in successful',
                    token
                });
            } else {
                res.status(401).json({ 
                    message: "Invalid Info" 
                });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.json({ message: "failed to logout" });
            } else {
                res.sendStatus(200).end({ message: "youre now logged out" });
            }
        });
    } else {
        res.status(200)
            .json({ 
                message: "ok then" 
            });
    }})



function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const options = {
        expiresIn: "8h"
    };
        return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router; 