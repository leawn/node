const express = require('express');

const app = express();

/*app.use((req, res, next) => {
    console.log('The first middleware function');
    res.send('<h1>The first response</h1>');
})*/

app.use('/users', (req, res, next) => {
    res.send('<h1>The users page</h1>')
});

/*app.use((req, res, next) => {
    console.log('The second middleware function');
    res.send('<h1>The second response</h1>')
})*/

app.use('/', (req, res, next) => {
    res.send('<h1>The main page better be at the bottom</h1>')
});

app.listen(3000);