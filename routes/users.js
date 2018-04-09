const usersRouter = require('express').Router();
const { getUserByUserName, getPopularUsers } = require('../controllers/users');

usersRouter.route('/').get(getPopularUsers);
usersRouter.route('/:user_name').get(getUserByUserName);

module.exports = { usersRouter };
