const User = require('../lib/user.js');
const path = require('path');
module.exports = function (req, res, next) {
    // if (req.session.uid) {
    //     User.getUserById(req.session.uid, (err, user) => {
    //         if (err) {
    //             return next(err);
    //         }
    //         req.user = res.locals.user = user;
    //         res.render('home', {name: user.name, title: 'home'});
    //     })
    // } else {
    //     res.render('home', {name: '陌生人', title: 'home'});
    // }
    res.sendFile(path.join(__dirname, '../clientApp/dist/index.html'));
}
