const mongo = require('mongoose');
const { Topics, Articles } = require('../models');

function getAllTopics(req, res, next) {
  Topics.find()
    .lean()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function getArticlesByTopicId(req, res, next) {
  const { topic_id } = req.params;
  Articles.find({ belongs_to: topic_id })
    .lean()
    .then(articles => {
      if (!articles.length) throw new Error('CODE:1');
      res.status(200).json({ articles });
    })
    .catch(err => {
      if (err.message === 'CODE:1')
        return next({ code: 1, msg: 'Document(s) Not Found' });
      next(err);
    });
}

module.exports = { getAllTopics, getArticlesByTopicId };
