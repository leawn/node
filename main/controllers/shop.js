const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Order = require('../models/Order');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product
        .find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(products => {
                    res.render('shop/product-list', {
                        prods: products,
                        pageTitle: 'Products',
                        path: '/products',
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .catch(err => {
            next(err);
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
                path: '/products'
                /*productCss: true,
                formsCss: true,
                isLoggedIn: req.session.isLoggedIn*/
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product
        .find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(products => {
                    res.render('shop/index', {
                        prods: products,
                        pageTitle: 'Shop',
                        path: '/',
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                        /*hasProducts: products.length > 0*/
                        /*productCss: true,
                        formsCss:true*/
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
    })
        .catch(err => {
        next(err);
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
                pageTitle: 'Your cart'
                /*productCss: true,
                formsCss: true,
                isLoggedIn: req.session.isLoggedIn*/
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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

exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            products = user.cart.items;
            total = 0;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            });
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: 'usd',
                        quantity: p.quantity
                    };
                }),
                success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
                cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
            });
        })
        .then(session => {
            res.render('shop/checkout', {
                products: products,
                path: '/checkout',
                pageTitle: 'Checkout',
                totalSum: total,
                sessionId: session.id
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCheckoutSuccess = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: { ...i.productId._doc }}
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user._id
                },
                products: products
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
                    email: req.user.email,
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
                /*productCss: true,
                formsCss:true,*/
                orders: orders
                /*isLoggedIn: req.session.isLoggedIn*/
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order
        .findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc.fontSize(14).text(`${prod.product.title}-${prod.quantity}x$${prod.product.price}`);
            });
            pdfDoc.fontSize(14).text(`Total price: $${totalPrice}`);
            pdfDoc.end();
            /*const file = fs.createReadStream(invoicePath);
            file.pipe(res);*/
            /*fs.readFile(invoicePath, (err, data) => {
                if (err) {
                    return next(err);
                }
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
                res.send(data);
            });*/
        })
        .catch(err => {
            next(err);
        });
}
