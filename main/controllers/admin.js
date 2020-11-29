const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        productCss: true,
        formsCss: true
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    return res.redirect(301, '/');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/product-admin', {
            prods: products,
            pageTitle: 'Admin Product List',
            path: '/admin/product-admin',
            hasProducts: products.length > 0,
            productCss: true,
            formsCss: true
        });
    });
}