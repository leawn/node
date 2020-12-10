const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const { body } = require('express-validator/check');

const router = express.Router();


router.get('/add-product',
    isAuth,
    adminController.getAddProduct
);

router.get(
    '/product-admin',
    isAuth,
    adminController.getProducts
);

router.post(
    '/add-product',
    body('title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({
            min: 5,
            max: 400
        })
        .trim(),
    isAuth,
    adminController.postAddProduct
);

router.get('/edit-product/:productId',
    isAuth,
    adminController.getEditProduct
);

router.post('/edit-product',
    body('title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({
            min: 5,
            max: 400
        })
        .trim(),
    isAuth,
    adminController.postEditProduct
);

router.post('/delete-product',
    isAuth,
    adminController.postDeleteProduct
);

/*router.get('/create-user', adminController.getCreateUser);*/

/*router.post('/create-user', adminController.postCreateUser);*/

module.exports = router;