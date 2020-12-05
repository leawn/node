const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/Product');
const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    .sync({})
    .then(() => {
        return User.findByPk(1);
        //console.log(result);
    })
    .then(user => {
        if(!user) {
            User.create({ name: 'Leo', email: 'dummyemail@gmail.com'});
        }
    })
    .catch(err => {
        console.log(err);
    })

app.listen(3000);