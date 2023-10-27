const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];
// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    // Error response: User already exists with the specified email
    const isEmailAvailable = await User.findOne({
      where : { email}
    });
    if(isEmailAvailable){
      // const err = new Error('User already exists');
      // err.status = 500;
      // err.title = 'User already exists ';
      // err.errors = { email: "User with that email already exists" };
      // return next(err);
      return res.status(500).json({ email: "User with that email already exists" });
    }
    // Error response: User already exists with the specified username
    const isUserAvailable = await User.findOne({
      where : { username }
    });
    if(isUserAvailable){
      // const err = new Error('User already exists');
      // err.status = 500;
      // err.title = 'User already exists';
      // err.errors = { "username": "User with that username already exists" };
      // return next(err);
      return res.status(500).json({ username: "User with that username already exists" });
    }

    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);



module.exports = router;
