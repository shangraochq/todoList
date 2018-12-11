const User = require('../lib/user.js');

exports.submit = function (req, res, next) {
    const data = req.body;
    User.authenticate(data.name, data.pass, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            req.session.uid = user.id;
            res.json({
                "retCode": 200,
                "data": user,
            });
        } else {
            res.json({
                "retCode": 400,
                "msg": "账号或者密码错误，请重新输入!",
            });
        }
    });
}

exports.logout = function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    })
}
