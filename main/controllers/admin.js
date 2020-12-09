const Product = require('../models/Product');
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
        editing: false
        /*isLoggedIn: req.session.isLoggedIn*/
    });
}

exports.postEditProduct = (req, res) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
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
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                /*formsCss: true,
                productCss: true,*/
                editing: editMode,
                product: product
                /*isLoggedIn: req.session.isLoggedIn*/
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postAddProduct = (req, res) => {
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
            console.log(err);
        });
}


exports.getProducts = (req, res) => {
    Product
        .find()
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
            console.log(err);
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
        .findByIdAndRemove(prodId)
        .then(() => {
            console.log('Deleted KEKL');
            res.redirect('/admin/product-admin');
        })
        .catch(err => {
            console.log(err);
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
