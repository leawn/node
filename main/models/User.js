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

const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;


class User {
    constructor(username, email, id) {
        this.username = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectId(id) : null;
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