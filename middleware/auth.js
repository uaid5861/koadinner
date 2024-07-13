const jwtKoa = require('koa-jwt');
const jwt = require('jsonwebtoken');
const { secret } = require('../utils/jwt');

// 新增的中间件，用于解码 token 并将 userId 存储到 ctx.state 中
const extractUserIdMiddleware = async (ctx, next) => {
    if (ctx.headers.authorization) {
        try {
            const token = ctx.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, secret);
            ctx.state.userId = decoded.id; // 将 userId 存储到 ctx.state 中
        } catch (error) {
            ctx.status = 401;
            ctx.body = { message: 'Invalid or expired token' };
            return;
        }
    }
    await next();
};

const authMiddleware = jwtKoa({ secret }).unless({ path: [/^\/login/, /^\/register/, /^\/products$/] });

module.exports = {
    authMiddleware,
    extractUserIdMiddleware,
};


// module.exports = jwtKoa({ secret }).unless({
//     path: [
//         /^\/login/, 
//         /^\/register/,
//         { url: /^\/products$/, methods: ['GET'] } // 仅开放 GET /products 接口
//     ]
// });