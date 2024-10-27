const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

//database
const connection = require('../database/db.config');
const { StatusCodes } = require('http-status-codes');

//register
const register = async function (req, res) {
  const { username, first_name, last_name, email, password } = req?.body;
  const flag = !username || !first_name || !last_name || !email || !password;
  console.log('Received body:(', req.body);
  //Guard value
  if (flag)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Please enter a provide value:(' });

  //database query
  try {
    //Guard User exist
    const [u] = await connection.query(
      `SELECT username, user_id, email FROM users WHERE username=? or email=?`,
      [username, email]
    );
    const isExist = u.length > 0;
    if (isExist)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          msg: `User already registered: check your username or email:(`,
        });

    //Guard password length
    if (password.length < 8)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `Password must be at least 8 characters:(` });

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Register user
    const user = `
     INSERT INTO users (username, first_name, last_name, email, password) VALUES(?,?,?,?,?)
      `;

    await connection.query(user, [
      username,
      first_name,
      last_name,
      email,
      hashedPassword,
    ]);

    res
      .status(StatusCodes.CREATED)
      .json({ msg: 'User registered successfully' });
  } catch (err) {
    console.log(err.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something went wrong: ${err.message}` });
  }
};

//login
const login = async function (req, res) {
  const { email, password } = req.body;

  //Guard
  const flag = !email || !password;
  if (flag)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Please enter a provide value:)' });

  try {
    //user selection
    const [user] = await connection.query(
      `SELECT username, password, user_id FROM users WHERE email = ? OR username = ?`,
      [email, email]
    );
    const isExist = user?.length > 0;

    //guard user exist
    if (!isExist)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid credential' });

    //check user password
    const isMatch = await bcrypt.compare(password, user[0].password);

    //guard password match
    if (!isMatch)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid password' });

    //generate token
    const { username, user_id } = user[0];
    const token = jwt.sign({ username, user_id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res
      .status(StatusCodes.OK)
      .json({ msg: 'user login successful', token, username });
  } catch (err) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      msg: 'Something went wrong: check your email or password',
    });
  }
};

//check
const check = async function (req, res) {
  const { user_id, username } = req.user;

  res.status(StatusCodes.OK).json({ msg: 'Valid user', user_id, username });
};

module.exports = { register, login, check };
