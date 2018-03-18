const articlesRouter = require('express').Router();
const {
  getAllArticles,
  getCommentsByArticleId,
  postNewCommentByArticleId,
  putArticleVoteUpOrDown
} = require('../controllers/articles');

articlesRouter.route('/').get(getAllArticles);
articlesRouter.route('/:article_id').put(putArticleVoteUpOrDown);
articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postNewCommentByArticleId);

module.exports = { articlesRouter };
