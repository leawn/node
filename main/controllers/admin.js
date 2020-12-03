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

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/product-admin');
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
    Product
        .create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
        .then(() => {
            //console.log(result);
            console.log('Created btw');
        })
        .catch((err) => {
            console.log(err);
        })
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

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/product-admin');
}