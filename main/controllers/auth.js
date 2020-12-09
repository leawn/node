const User = require('../models/User');

exports.getLogin = (req, res, next) => {
    /*const isLoggedIn = req
        .get('Cookie')
        .trim()
        .split('=')[1];*/
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        productCss: true,
        formsCss: true,
        isLoggedIn: req.session.isLoggedIn
    })
};

exports.postLogin = (req, res, next) => {
    User
        .findById("5fcf6352087bc3acd68d8b85")
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
        })
        .then(() => {
            console.log('Logged in, hello, leo');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}