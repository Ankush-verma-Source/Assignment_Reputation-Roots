const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');

router.post(
    '/register',
    [
        body('username', 'Username is required').notEmpty(),
        body('password', 'Password must be at least 6 characters').isLength({
            min: 6,
        }),
    ],
    validate,
    registerUser
);

router.post(
    '/login',
    [
        body('username', 'Username is required').notEmpty(),
        body('password', 'Password is required').notEmpty(),
    ],
    validate,
    loginUser
);

module.exports = router;
