const app = require('./server');
const PORT = require('./config').PORT[process.env.NODE_ENV];

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});