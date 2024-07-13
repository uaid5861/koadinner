const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

exports.register = async (ctx) => {
    const { username, password } = ctx.request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ username, password: hashedPassword });
        ctx.body = { message: 'User created successfully', user: { username: user.username } };
    } catch (error) {
        ctx.status = 400;
        ctx.body = { message: 'User registration failed', error };
    }
};

exports.login = async (ctx) => {
    const { username, password } = ctx.request.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        ctx.status = 401;
        ctx.body = { message: 'Authentication failed' };
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        ctx.status = 401;
        ctx.body = { message: 'Authentication failed' };
        return;
    }

    const token = generateToken(user);
    ctx.body = { message: 'Login successful', token };
};
