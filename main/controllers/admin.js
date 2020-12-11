const mongoose = require('mongoose');
const Product = require('../models/Product');
const { validationResult } = require('express-validator/check');
/*const User = require('../models/User');*/

exports.getAddProduct = (req, res) => {
        /*if (req.locals.isLoggedIn) {
        return res.redirect('/login');
    }*/
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        /*productCss: true,
        formsCss: true,*/
        editing: false,
        hasError: false,
        errorMessage: req.flash('error')
        /*isLoggedIn: req.session.isLoggedIn*/
    });
}

exports.postEditProduct = (req, res) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: true,
                hasError: true,
                product: {
                    title: updatedTitle,
                    imageUrl: updatedImageUrl,
                    description: updatedDesc,
                    price: updatedPrice,
                    _id: prodId
                },
                errorMessage: errors.array()
            });
    }
    /*const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDesc,
        updatedImageUrl,
        prodId
    );*/
    Product
        .findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;
            return product
                .save()
                .then(() => {
                    console.log('Updated monkaOMEGA');
                    res.redirect('/admin/product-admin');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    /*product
        .save()
        .then(() => {
            console.log('Updated monkaOMEGA');
            res.redirect('/admin/product-admin');
        })
        .catch(err => {
            console.log(err);
        });*/
    /*Product
        .findById(prodId)
        .then(productData => {*/
            /*product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;*/
            /*return product.save();*/
        /*})*/
}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
       return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product
        .findById(prodId)
    /*req.user
        .getProducts({ where: { id: prodId } })*/
    /*Product
        .findByPk(prodId)*/
        .then(product => {
            /*const product = products[0];*/
            if (!product) {
                return res.redirect('   /');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                /*formsCss: true,
                productCss: true,*/
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: req.flash('error')
                /*isLoggedIn: req.session.isLoggedIn*/
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('admin/edit-product', {
                pageTitle: 'Add product',
                path: '/admin/add-product',
                editing: false,
                hasError: true,
                product: {
                    title: title,
                    imageUrl: imageUrl,
                    description: description,
                    price: price
                },
                errorMessage: errors.array()
                /*hasProducts: products.length > 0*/
                /*formsCss: true,
                productCss: true,
                isLoggedIn: req.session.isLoggedIn*/
        });
    }
    /*req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
        })*/
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user._id
    });
    product
        .save()
        .then(() => {
            console.log('Created btw');
            res.redirect('/admin/product-admin');
        })
        .catch((err) => {
            /*res.redirect('/server-error');*/
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}


exports.getProducts = (req, res) => {
    Product
        .find({
            userId: req.user._id
        })
        /*.select('title price -_id')
        .populate('userId', 'name')*/
        .then(products => {
            res.render('admin/product-admin', {
                prods: products,
                pageTitle: 'Admin Product List',
                path: '/admin/product-admin',
                hasProducts: products.length > 0
                /*formsCss: true,
                productCss: true,
                isLoggedIn: req.session.isLoggedIn*/
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    /*req.user
        .getProducts()
        .then(products => {
            res.render('admin/product-admin', {
                prods: products,
                pageTitle: 'Admin Product List',
                path: '/admin/product-admin',
                hasProducts: products.length > 0,
                productCss: true,
                formsCss: true
            });
        })
        .catch(err => {
            console.log(err);
        });*/
}


exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product
        /*.findById(prodId)*/
        /*.deleteById(prodId)*/
        /*.then(product => {
            return product.destroy();
        })*/
        .deleteOne({
            _id: prodId,
            userId: req.user._id
        })
        .then(() => {
            console.log('Deleted KEKL');
            res.redirect('/admin/product-admin');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

/*
exports.getCreateUser = (req, res) => {
    res.render('admin/create-user', {
        pageTitle: 'Create User',
        path: 'admin/create-user',
        productCss: true,
        formsCss: true
    })
}

exports.postCreateUser = (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const user = new User(username, email);
    user
        .save()
        .then(() => {
            console.log('Created new user');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}*/
