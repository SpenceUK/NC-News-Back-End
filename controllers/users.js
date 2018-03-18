const { Users } = require('../models');

function getUserByUserName(req, res, next) {
  const { user_name } = req.params;
  Users.findOne({ username: user_name })
    .then(user => {
      if (!user) {
        const error = new Error('User does not Exist');
        error.name = 'Find Error';
        throw error;
      }
      res.status(200).send({ user });
    })
    .catch(err => {
      if (err.name === 'Find Error')
        return next({
          code: 1,
          msg: err.message
        });
      next(err);
    });
}

module.exports = { getUserByUserName };
