/* eslint-disable no-console */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const app = require('./server');
const PORT =
  process.env.NODE_ENV === 'production'
    ? process.env.PORT
    : require('./config').PORT[process.env.NODE_ENV];

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});
