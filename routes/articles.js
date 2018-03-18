const articlesRouter = require('express').Router();
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postNewCommentByArticleId,
  putArticleVoteUpOrDown
} = require('../controllers/articles');

articlesRouter.route('/').get(getAllArticles);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .put(putArticleVoteUpOrDown);
articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postNewCommentByArticleId);

module.exports = { articlesRouter };
