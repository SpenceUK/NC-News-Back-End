const commentsRouter = require('express').Router();
const {
  putCommentVoteUpOrDown,
  deleteCommentById,
  getCommentById
} = require('../controllers/comments');

commentsRouter
  .route('/:comment_id')
  .get(getCommentById)
  .put(putCommentVoteUpOrDown)
  .delete(deleteCommentById);

module.exports = { commentsRouter };
