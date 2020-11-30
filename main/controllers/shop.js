const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            hasProducts: products.length > 0,
            productCss: true,
            formsCss:true
        });
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products',
            productCss: true,
            formsCss: true
        })
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            productCss: true,
            formsCss:true
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Your cart',
        path: '/cart',
        productCss: true,
        formsCss:true
    });
}

exports.postCart= (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        productCss: true,
        formsCss:true
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        productCss: true,
        formsCss:true
    });
}