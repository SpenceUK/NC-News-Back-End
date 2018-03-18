const apiRouter = require('express').Router();
const { getReadMe } = require('../controllers/api');
const {
  topicsRouter,
  articlesRouter,
  usersRouter,
  commentsRouter
} = require('../routes');

apiRouter.route('/').get(getReadMe);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = { apiRouter };
