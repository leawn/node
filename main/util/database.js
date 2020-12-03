const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'leawn',
    database: 'node_complete',
    password: 'Leonboss62!'
});

module.exports = pool.promise();