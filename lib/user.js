const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, "../data/user.json");
const db = require('../model/util');
class User {
    constructor(user) {
        Object.keys(user).forEach((key) => {
            this[key] = user[key];
        });
    }
    save(cb) {
        this.id = String(this.name) + new Date().getTime();
        this.hashPassword((err) => {
            if (err) {
                return cb(err);
            }
            db.__insertOne('user', this, (err, result) => {
                cb(err);
            });
        });
    }
    hashPassword(cb) {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) return cb(err);
            this.salt = salt;
            bcrypt.hash(this.pass, salt, (err, hash) => {
                if (err) return cb(err);
                this.pass = hash;
                cb();
            })
        });
    }
    static getUserByName(name, cb) {
        db.__findByPage('user', { name: name }, (err, result) => {
            cb(err, result);
        })
    }
    static authenticate(name, pass, cb) {
        User.getUserByName(name, (err, user) => {
            user = user[0];
            if (err || !user) {
                return cb(err);
            }
            bcrypt.hash(pass, user.salt, (err, hashPass) => {
                if (err) {
                    return cb(err);
                }
                if (hashPass === user.pass) {
                    return cb(null, user);
                };
                cb();
            });
        })
    }
    static getUserById(id, cb) {
        db.__findByPage('user', { id: id }, (err, result) => {
            cb(err, result[0]);
        })
    }
}

module.exports = User;
