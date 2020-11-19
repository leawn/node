const express = require('express');

const router = express.Router();
const users = [];

router.get('/', (req, res, next) => {
    res.render('add-user', {
        path: '/',
        pageTitle: "Add new user"
    });
});

router.post('/', (req, res, next) => {
    users.push({username: req.body.name});
    res.redirect('/');
})

exports.router = router;
exports.users = users;