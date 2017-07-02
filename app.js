import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts';
import expressSession from 'express-session';

import users from './routes/users';
import index from './routes/index';
import signUp from './routes/signUp';
import home from './routes/home';
import signOut from './routes/signOut';
import myprofile from './routes/myprofile';
import settings from './routes/settings';

const app = express();

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
app.use('/signUp', signUp);
app.use('/home', home);
app.use('/myprofile', myprofile);
app.use('/signOut', signOut);
app.use('/settings', settings);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;