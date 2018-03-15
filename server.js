if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var config = require('./config');
var db = config.DB[process.env.NODE_ENV] || process.env.DB;
mongoose.Promise = Promise;

mongoose
  .connect(db, { useMongoClient: true })
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));

app.use(bodyParser.json());
app.use(morgan('dev'));

module.exports = app;
