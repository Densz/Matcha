//   /usr/local/mongodb/bin/mongod --dbpath ~/http/MyWebSite/matcha/mongodb
//   /usr/local/mongodb/bin/mongo
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var expressSession = require('express-session');


var index = require('./routes/index');
var users = require('./routes/users');
var signIn = require('./routes/signIn');
var signUp = require('./routes/signUp');
var home = require('./routes/home');
var signOut = require('./routes/signOut');
var myprofile = require('./routes/myprofile');
var settings = require('./routes/settings');


var app = express();

// view engine setup
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

app.use(expressLayouts);
app.use('/', index);
app.use('/users', users);
app.use('/signIn', signIn);
app.use('/signUp', signUp);
app.use('/home', home);
app.use('/myprofile', myprofile);
app.use('/signOut', signOut);
app.use('/settings', settings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;