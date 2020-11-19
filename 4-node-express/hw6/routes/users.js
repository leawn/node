const express = require('express');
const data = require('./add-user');

const router = express.Router();

router.get('/users', (req, res, next) => {
    const users = data.users;
    res.render('users', {
        users: users,
        path: '/users',
        pageTitle: 'Users'
    });
});

module.exports = router;