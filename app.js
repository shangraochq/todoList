var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var csurf = require('csurf');
var compression = require('compression')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var messages = require('./lib/message.js');
var home = require('./routes/home');
var register = require('./routes/register');
var login = require('./routes/login');
var user = require('./routes/users');
var api = require('./routes/api');
var todo = require('./routes/todo.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(express.favicon());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
     secret: 'secret'
}));
// app.use(csurf());
app.use(compression());
app.use(express.static(path.join(__dirname, './clientApp/dist')));
app.use(messages);

app.use('/app', home);
app.get('/ajax/getUserInfo', user.getUserInfo);
app.post('/ajax/addTodo', todo.addToDo);
app.get('/ajax/getToDoList', todo.getToDoList);
app.post('/ajax/register', register.submit);
app.post('/ajax/login', login.submit);
app.post('/ajax/editContent', todo.editToDo);
app.post('/ajax/addToCompletedOrBack', todo.addToCompletedOrBack);
app.get('/logout', login.logout);
app.get('/api/user/:userName', api.user);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   res.status(404);
//   res.render('404');
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  // render the error page
  res.status(err.status || 500);
  res.end();
});

module.exports = app;
