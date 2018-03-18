function getReadMe(req, res, next) {
  res.status(200).send({ page: 'readme' });
}

module.exports = { getReadMe };
