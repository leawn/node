const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
/*const sequelize = require('./util/database');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');*/
/*const mongoConnect = require('./util/database').mongoConnect;*/
const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    /*User
        .findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });*/
    User
        .findById("5fce52f077756cacf98d8bff")
        .then(user => {
            req.user = new User(user.username, user.email, user._id, user.cart);
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

mongoose
    .connect('mongodb://localhost:27017/shop')
    .then(() => {
    app.listen(3000);
})
    .catch(err => {
        console.log(err);
    });

/*mongoConnect(() => {
    app.listen(3000);
});*/

/*

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    .sync()
    .then(() => {
        return User.findByPk(1);
        //console.log(result);
    })
    .then(user => {
        if(!user) {
            return User.create({ name: 'Leo', email: 'dummyemail@gmail.com' });
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });*/
