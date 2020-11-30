const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        productCss: true,
        formsCss: true,
        editing: false
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
       return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            productCss: true,
            formsCss: true,
            editing: editMode,
            product: product
        });
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