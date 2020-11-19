const express = require('express');
const bodyParser = require('body-parser');
const addUserRoute = require('./routes/add-user');
const usersRoute = require('./routes/users');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(addUserRoute.router);
app.use(usersRoute);

app.listen(4000);