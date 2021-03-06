const mongoose = require('mongoose');
/*const mongodb = require('mongodb');*/

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    this.cart = {
        items: updatedCartItems
    };
    return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
    this.cart.items = this.cart.items.filter(i => {
        return i.productId.toString() !== productId.toString();
    });
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

/*const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});*/

/*
const mongodb = require('mongodb');
/!*const getDb = require('../util/database').getDb;*!/


class User {
    constructor(username, email, id, cart) {
        this.username = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.cart = cart; // { items: [] }
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db
                .collection('users')
                .updateOne(
                    { _id: this._id }, { $set: this }
                );
        } else {
            dbOp = db
                .collection('users')
                .insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity
            })
        }

        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }
                );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        })
        return db
            .collection('products')
            .find({ _id: { $in: productIds }})
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(i => {
            return i.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: {
                    cart: {
                        items: updatedCartItems
                    }
                    }
                }
            );
    }

    addOrder() {
        const db = getDb();
        return this
            .getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        username: this.username,
                        email: this.email
                    }
                }
                return db
                    .collection('orders')
                    .insertOne(order);
            })
            .then(result => {
                this.cart = {items: []};
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new mongodb.ObjectId(this._id) },
                        { $set: {
                                cart: {
                                    items: []
                                }
                            }
                        }
                    );
            })
            .catch(err => {
                console.log(err);
            });
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders')
            .find({ 'user._id': new mongodb.ObjectId(this._id) })
            .toArray()
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .find({ _id: new mongodb.ObjectId(userId) })
            .next()
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = User;
*/
