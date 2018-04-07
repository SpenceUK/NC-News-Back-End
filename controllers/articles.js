const { Articles, Comments, Users } = require('../models');

function getAllArticles(req, res, next) {
  Articles.find()
    .populate('belongs_to')
    .populate('created_by')
    .exec()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  Articles.findOne({ _id: article_id })
    .populate('belongs_to')
    .populate('created_by')
    .exec()
    .then(article => {
      if (!article) {
        const error = new Error('Article does not Exist');
        error.name = 'Find Error';
        throw error;
      }
      res.status(200).send({ article });
    })
    .catch(err => {
      if (err.name === 'Find Error')
        return next({
          code: 1,
          msg: err.message
        });
      if (err.name === 'CastError')
        return next({
          code: 1,
          msg: 'Incorrect article id'
        });
      next(err);
    });
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  Articles.findOne({ _id: article_id })
    .populate('belongs_to')
    .populate('created_by')
    .populate({
      path: 'Comments',
      populate: { path: 'created_by' }
    })
    .exec()
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
      next(err);
    });
}

function putArticleVoteUpOrDown(req, res, next) {
  const { vote } = req.query;
  const { article_id } = req.params;
  let query;
  if (vote === 'up') query = 1;
  else if (vote === 'down') query = -1;
  else throw new Error('Query Error');
  Articles.findOneAndUpdate({ _id: article_id }, { $inc: { votes: query } })
    .then(() => {
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
  getArticleById,
  getCommentsByArticleId,
  postNewCommentByArticleId,
  putArticleVoteUpOrDown
};
