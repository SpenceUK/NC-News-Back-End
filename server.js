if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';
const app = require('express')();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const { apiRouter } = require('./routes/api');
const DB_URL = process.env.DB_URL || config.DB[process.env.NODE_ENV];

app.use(bodyParser.json());
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

mongoose.Promise = Promise;
mongoose
  .connect(DB_URL, { useMongoClient: true })
  .then(() => {
    if (process.env.NODE_ENV !== 'test')
      console.log(
        `successfully connected to: ${config.DB[process.env.NODE_ENV]}`
      );
  })
  .catch(err => {
    console.log(`connection Error ${err}`);
  });

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ msg: 'Page not found.' });
});

app.use((err, req, res, next) => {
  if (err.code === 1)
    return res.status(400).send({ error: 'Bad Request', msg: err.msg });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.message === 'Query Error')
    return res
      .status(400)
      .send({ error: 'Bad Request', msg: 'Incorrect Query type' });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.toString().includes('Error: Argument passed in'))
    return res
      .status(400)
      .send({ error: 'Bad Request', msg: 'Incorrect document id' });
  next(err);
});

app.use((err, req, res, next) => {
  if ((err.code = 400)) return res.status(400).send({ msg: 'Bad Request' });
  next(err);
});

app.use((err, req, res, next) => {
  return res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
