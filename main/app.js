const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

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

const MONGODB_URI = 'mongodb://localhost:27017/shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
    })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

/*app.use((req, res, next) => {
    /!*User
        .findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });*!/
    /!*User
        .findById("5fcf6352087bc3acd68d8b85")
        .then(user => {
            req.session.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });*!/
});*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/server-error', errorController.getServerError);

app.use(errorController.getNotFound)

app.use((error, req, res, next) => {
    /*res.status(error.httpStatusCode).render() |*/
    res
        .status(500)
        .render('/server-error', {
            pageTitle: 'Error!',
            path: '/500',
            isLoggedIn: req.session.isLoggedIn
        });
})

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        /*User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Leo',
                    email: 'leonrubner2809@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save()
                    .then(() => {
                        console.log('saved');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })*/
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
