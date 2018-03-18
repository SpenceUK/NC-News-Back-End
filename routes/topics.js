const topicsRouter = require('express').Router();
const { getAllTopics, getArticlesByTopicId } = require('../controllers/topics');

topicsRouter.route('/').get(getAllTopics);
topicsRouter.route('/:topic_id/articles').get(getArticlesByTopicId);

module.exports = { topicsRouter };
