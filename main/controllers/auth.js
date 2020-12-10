const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

/*const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '$'
    }
}));*/

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        /*console.log(errors.array());*/
        return res
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()
            });
    }

    User
        .findOne({email: email})
        .then(user => {
        /*.then(user => {*/
            /*if (!user) {
                req.flash('error', 'Invalid email.');
                return res.redirect('/login');
            }*/
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
                })
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
    /*const confirmPassword = req.body.confirmPassword;*/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res
            .status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array(),
                oldInput: {
                    email: email,
                    password: password,
                    confirmPassword: req.body.confirmPassword
                },
                validationErrors: errors.array()
            });
    }
    /*User
        .findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash(
                    'error',
                    'Email already exists.'
                );
                return res.redirect('/signup');
            }*/
            bcrypt
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
                    return transporter.sendMail({
                        to: email,
                        from: 'node@complete.com',
                        subject: 'Signup succeeded',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        /*.catch(err => {
            console.log(err);
        });*/
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash('error'),
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
        /*isLoggedIn: false*/
    });
}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: req.flash('error')
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User
            .findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(() => {
                res.redirect('/');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'node@complete.com',
                    subject: 'Password reset',
                    html:
                        `<p>You requested password reset</p>
                         <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`
                });
            })
            .catch(err => {
                console.log(err);
            });
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User
        .findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        }
    })
        .then(user => {
            if (!user) {
                req.flash(type)
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New password',
                errorMessage: req.flash('error'),
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User
        .findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(() => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}