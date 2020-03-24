const bcrypt = require('bcryptjs');
const express = require('express');

const router = express.Router();
const Users = require("./user-model.js");

router.get('/', (req, res) => {
    Users.find().then(user => {
        res.status(200).json(user);
    }).catch(err => {
        res.status(500).json({
            errorMessage:'500 error',
            err
        })
    })
});

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
    const { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({
                    message:'Log in successful'
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

module.exports = router; 