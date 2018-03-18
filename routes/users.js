const usersRouter = require('express').Router();
const { getUserByUserName } = require('../controllers/users');

usersRouter.route('/:user_name').get(getUserByUserName);

module.exports = { usersRouter };
