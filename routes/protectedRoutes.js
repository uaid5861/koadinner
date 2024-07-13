const Router = require('koa-router');

const router = new Router();

router.get('/protected', async (ctx) => {
    ctx.body = { message: 'Protected route', user: ctx.state.user };
    
});

module.exports = router;
