const User = require('../lib/user.js');

exports.user = function (req, res, next) {
    User.getUserByName(req.params.userName, function (err, user) {
        if (err) return next(err);
        if (!user.id) return res.send(404);
        res.json(user);
    });
};
