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

/*exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product
        .findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;
            return product.save();
        })
        .then(() => {
            console.log('Updated monkaOMEGA');
            res.redirect('/admin/product-admin');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
       return res.redirect('/')
    }
    const prodId = req.params.productId;
    req.user
        .getProducts({ where: { id: prodId } })
    /!*Product
        .findByPk(prodId)*!/
        .then(products => {
            const product = products[0];
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
        })
        .catch(err => {
            console.log(err);
        });
}*/

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    /*req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
        })*/
    const product = new Product(title, price, description, imageUrl);
    product
        .save()
        .then(() => {
            console.log('Created btw');
            res.redirect('/admin/product-admin');
        })
        .catch((err) => {
            console.log(err);
        })
}

/*
exports.getProducts = (req, res, next) => {
    req.user
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
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            console.log('Destroyed KEKL');
            res.redirect('/admin/product-admin');
        })
        .catch(err => {
            console.log(err);
        });
}*/
