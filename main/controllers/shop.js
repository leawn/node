const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getProducts = (req, res) => {
    Product
        .find()
        /*.fetchAll()*/
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products',
                hasProducts: products.length > 0,
                productCss: true,
                formsCss:true
            });
        })
        .catch(err => {
            console.log(err);
        });
}


exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    /*Product
        .findAll({ where: { id: prodId } })
        .then(products => {
            res.render('shop/product-detail', {
                product: products[0],
                pageTitle: products[0].title,
                path: '/products',
                productCss: true,
                formsCss: true
            });
        })
        .catch(err => {
            console.log(err);
        });*/
    Product
        .findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
                productCss: true,
                formsCss: true
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getIndex = (req, res) => {
    Product
        .find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                productCss: true,
                formsCss:true
            });
        })
        .catch(err => {
            console.log(err);
        });
}


exports.getCart = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                products: products,
                path: '/cart',
                pageTitle: 'Your cart',
                productCss: true,
                formsCss: true
            });
        })
        .catch(err => {
            console.log(err);
        });
        /*.then(cart => {
            return cart
                .getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        pageTitle: 'Your cart',
                        path: '/cart',
                        productCss: true,
                        formsCss:true,
                        products: products
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });*/
}

exports.postCart= (req, res) => {
    const prodId = req.body.productId;
    Product
        .findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
    /*let fetchedCart;
    let newQuantity = 1
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } } )
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product
                .findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through:
                    { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });*/
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(() => {
            res.redirect('cart');
        })
        .catch(err => {
            console.log(err);
        });
    /*    .getCart()
        .then(cart => {
            return cart.getProducts({ where:
                    { id: prodId }
            });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });*/
}

exports.postOrder = (req, res, next) => {
    /*let fetchedCart;*/
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: { ...i.productId._doc }}
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user._id
                },
                products: products
            });
            return order.save();
        })
    /*req.user
        .addOrder()*/
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
    /*req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .then(item => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })*/
}

exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user.userId': req.user._id })
    /*req.user
        .getOrders(/!*{ include: ['products'] }*!/)*/
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                productCss: true,
                formsCss:true,
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        })
}
