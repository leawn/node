const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'leawn', 'Leonboss62!', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;