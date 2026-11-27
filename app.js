var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var taskRouter = require('./routes/task.routes');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/tasks', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Route not found'));
});

// error handler
app.use(errorHandler);

module.exports = app;
