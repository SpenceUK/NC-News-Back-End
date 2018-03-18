const { Comments } = require('../models');
const mongoose = require('mongoose');

function getCommentById(req, res, next) {
  const { comment_id } = req.params;
  Comments.findOne({ _id: mongoose.Types.ObjectId(comment_id) })
    .then(comment => {
      if (!comment) {
        const error = new Error('Comment does not Exist');
        error.name = 'Find Error';
        throw error;
      }
      res.status(200).send({ comment });
    })
    .catch(err => {
      if (err.name === 'Find Error') return next({ code: 1, msg: err.message });
      next(err);
    });
}

function putCommentVoteUpOrDown(req, res, next) {
  const { vote } = req.query;
  const { comment_id } = req.params;
  if (vote === 'up') query = 1;
  else if (vote === 'down') query = -1;
  else throw new Error('Query Error');
  Comments.findOneAndUpdate({ _id: comment_id }, { $inc: { votes: query } })
    .then(result => {
      res.status(204).send();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return next({
          code: 1,
          msg: 'Comment id incorrect'
        });
      next(err);
    });
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  Comments.deleteOne({ _id: comment_id })
    .then(result => {
      if (result.result.n === 0) {
        const error = new Error('Comment Does not Exist');
        error.name = 'Delete Error';
        throw error;
      }
      res.status(200).send({ msg: 'Comment Deleted' });
    })
    .catch(err => {
      if (err.name === 'CastError')
        return next({
          code: 1,
          msg: 'Comment id incorrect'
        });
      if (err.name === 'Delete Error')
        return next({
          code: 1,
          msg: err.message
        });
      next(err);
    });
}

module.exports = { putCommentVoteUpOrDown, deleteCommentById, getCommentById };
