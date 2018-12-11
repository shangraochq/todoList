const User = require("../lib/user.js");

exports.getUserInfo = function (req, res, next) {
    if (req.session.uid) {
        User.getUserById(req.session.uid, (err, user) => {
            if (err) {
                return next(err);
            }
            res.json(user || {});
        })
    } else {
        res.json({});
    }
}
