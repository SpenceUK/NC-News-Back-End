const path = require('path');

function getReadMe(req, res, next) {
  res
    .status(200)
    .sendFile(path.normalize(path.join(__dirname + '/../views/api.html')));
}

module.exports = { getReadMe };
