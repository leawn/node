const express = require('express');
const bodyParser = require('body-parser');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');
const expressHbs = require('express-handlebars');

const app = express();

app.engine('handlebars', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout'}));
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin' ,adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('not-found-handlebars', {pageTitle: 'Not found 404'})
})

app.listen(3000);