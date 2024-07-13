const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const { authMiddleware, extractUserIdMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { redisClient, redisSubscriber, redis } = require('./config/redis');
const Order = require('./models/Order');

const app = new Koa();

app.use(errorHandler);
app.use(bodyParser());
app.use(extractUserIdMiddleware); // 使用 extractUserIdMiddleware 中间件
app.use(authMiddleware); // 使用 authMiddleware 进行 token 验证
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(productRoutes.routes()).use(productRoutes.allowedMethods());
app.use(categoryRoutes.routes()).use(categoryRoutes.allowedMethods());
app.use(orderRoutes.routes()).use(orderRoutes.allowedMethods());
app.use(protectedRoutes.routes()).use(protectedRoutes.allowedMethods());

async function handleOrderExpiration(orderId) {
    const order = await Order.findByPk(orderId);
    if (order && order.status === 'pending') {
        order.status = 'cancelled';
        await order.save();
        console.log(`Order ${orderId} has been cancelled due to timeout.`);
    }
}

redisSubscriber.psubscribe('__keyevent@0__:expired', (err, count) => {
    if (err) {
        console.error('Failed to subscribe: %s', err.message);
    } else {
        console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
    }
});

redisSubscriber.on('pmessage', (pattern, channel, message) => {
    const orderId = message.split(':')[1];
    handleOrderExpiration(orderId);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
