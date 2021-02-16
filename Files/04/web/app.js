var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var webLogger = require('./winston')('web');

var indexRouter = require('./routes/index');
var headersRouter = require('./routes/headers');
var holidayRouter = require('./routes/holiday');
var myProfileRouter = require('./routes/myprofile');
var logsRouter = require('./routes/logs');

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('combined', { stream: webLogger.stream.write }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  webLogger.error(`[${req.ip}][${req.originalUrl}][${req.method}] accessing...`);
  next();
})

var options = {}

app.use('/', indexRouter);
app.use('/headers', headersRouter);
app.use('/myprofile', myProfileRouter);
app.use('/holiday', holidayRouter);
app.use('/logs', logsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  webLogger.error(`[${req.ip}][${req.originalUrl}][${req.method}] ${err.message}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
