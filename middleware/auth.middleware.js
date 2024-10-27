const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer'))
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Authentication failed:)' });

  const token = authHeader.split(' ')[1];

  try {
    const { username, user_id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      user_id,
      username,
    };
    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: `Invalid token:${err.message}` });
  }
};

module.exports = auth;
