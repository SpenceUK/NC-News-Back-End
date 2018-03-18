const { topicsRouter } = require('./topics');
const { articlesRouter } = require('./articles');
const { usersRouter } = require('./users');
const { commentsRouter } = require('./comments');

module.exports = { topicsRouter, articlesRouter, usersRouter, commentsRouter };
