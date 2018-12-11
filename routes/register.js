const User = require("../lib/user.js");
const fs = require("fs");
exports.form = function (req, res, next) {
    res.render('register', {
        title: "register"
    })
}
exports.submit = function (req, res, next) {
    const data = req.body;
    User.getUserByName(data.name, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user.length >= 1) {
            return res.json({msg: '用户名已存在', retCode: 300});
        }
        user = new User({
            name: data.name,
            pass: data.pass
        });
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.session.uid = user.id;
            res.json({retCode : 200});
        })
    })
}
