const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/User');

const router = express.Router();

router.get(
    '/login',
    authController.getLogin
);
router.get(
    '/signup',
    authController.getSignup
);
router.post(
    '/signup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email already exists.');
                    }
                });
            /*if (value === 'test@test.com') {
                throw new Error('This email address is forbidden.');
            }
            return true;*/
        }),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters'
    )
        .isLength({
            min: 5
        })
        .isAlphanumeric(),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match')
            }
            return true;
    }),
    authController.postSignup
);
router.post(
    '/login',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(user => {
                    if (!user) {
                        return Promise.reject('Invalid email.');
                    }
                    return true;
                });
        }),
    authController.postLogin
);
router.post(
    '/logout',
    //check(''),
    authController.postLogout
);
router.get(
    '/reset',
    authController.getReset
);
router.post(
    '/reset',
    //check(''),
    authController.postReset
);
router.get(
    '/reset:token',
    authController.getNewPassword
);
router.post(
    '/new-password',
    //check(''),
    authController.postNewPassword
);

module.exports = router;