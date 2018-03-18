const { Articles, Comments, Users } = require('../models');
const mongoose = require('mongoose');

function getAllArticles(req, res, next) {
  Articles.find()
    .lean()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  return new Promise((res, rej) => {
    let data = [];
    Articles.aggregate()
      .match({ _id: mongoose.Types.ObjectId(article_id) })
      .lookup({
        from: 'comments',
        localField: '_id',
        foreignField: 'belongs_to',
        as: 'comments'
      })
      .sort({ body: 1 })
      .cursor({})
      .exec()
      .on('data', doc => data.push(doc))
      .on('end', () => {
        res(data[0]);
      });
  })
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      if (err.toString().includes('Error: Argument passed in'))
        return next({ code: 1, msg: 'Incorrect article id' });
      next(err);
    });
}

function postNewCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { comment, created_by } = req.body;
  Articles.findById(article_id)
    .then(() => {
      return Users.findById(created_by);
    })
    .then(() => {
      return new Comments({
        body: comment,
        belongs_to: article_id,
        created_by: created_by
      }).save();
    })
    .then(commentDoc => {
      res.status(201).send({ commentDoc });
    })
    .catch(err => {
      if (err.name === 'CastError')
        return next({ code: 1, msg: 'Article or User does not exist' });
      console.log(err);
      next(err);
    });
}

function putArticleVoteUpOrDown(req, res, next) {
  const { vote } = req.query;
  const { article_id } = req.params;
  if (vote === 'up') query = 1;
  else if (vote === 'down') query = -1;
  else throw new Error('Query Error');
  Articles.findOneAndUpdate({ _id: article_id }, { $inc: { votes: query } })
    .then(result => {
      res.status(204).send();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return next({ code: 1, msg: 'Article does not exist' });
      next(err);
    });
}

module.exports = {
  getAllArticles,
  getCommentsByArticleId,
  postNewCommentByArticleId,
  putArticleVoteUpOrDown
};
