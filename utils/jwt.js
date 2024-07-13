// jwt.js
const jwt = require('jsonwebtoken');

const secret = 'tfadmin';

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
};

module.exports = {
    secret,
    generateToken,
};
