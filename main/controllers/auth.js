const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLogin = (req, res, next) => {
    /*const isLoggedIn = req
        .get('Cookie')
        .trim()
        .split('=')[1];*/
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
        /*productCss: true,
        formsCss: true,
        isLoggedIn: req.session.isLoggedIn*/
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User
        .findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email.');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        })
                    }
                    req.flash('error', 'Invalid password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
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

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User
        .findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exists.');
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    });
                    return user.save();
                })
                .then(() => {
                    res.redirect('/login');
                })

        })
        .catch(err => {
            console.log(err);
        });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup'
        /*isLoggedIn: false*/
    });
}