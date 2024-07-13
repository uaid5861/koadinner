// orderController.js
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const { redisClient } = require('../config/redis');
// 为了测试把时间缩短
const FIVE_MINUTES = 5 * 60 * 1000;

exports.placeOrder = async (ctx) => {
    const { items } = ctx.request.body; // items should be an array of { productId, quantity }
    const userId = ctx.state.userId; // 从 ctx.state 中获取 userId

    try {
        let totalPrice = 0;

        for (let item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                ctx.status = 404;
                ctx.body = { message: `Product with ID ${item.productId} not found` };
                return;
            }
            totalPrice += product.price * item.quantity;
        }

        const order = await Order.create({
            orderNumber: await getOrderNumber(),
            status: 'pending',
            totalPrice,
            expiresAt: new Date(Date.now() + FIVE_MINUTES),
            UserId: userId,
        });

        for (let item of items) {
            const product = await Product.findByPk(item.productId);
            await OrderItem.create({
                quantity: item.quantity,
                price: product.price, // Ensure that the price is set correctly
                OrderId: order.id,
                ProductId: item.productId,
            });
        }

        await redisClient.set(`order:${order.id}`, JSON.stringify(order), 'PX', FIVE_MINUTES);

        ctx.body = { message: 'Order placed successfully', order };
    } catch (error) {
        console.error('Order placement failed:', error); // 打印错误到控制台
        ctx.status = 400;
        ctx.body = { message: 'Order placement failed', error: error.message };
    }
};

exports.cancelOrder = async (ctx) => {
    const { orderId } = ctx.params;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            ctx.status = 404;
            ctx.body = { message: 'Order not found' };
            return;
        }
        order.status = 'cancelled';
        await order.save();
        await redisClient.del(`order:${orderId}`);
        ctx.body = { message: 'Order cancelled successfully', order };
    } catch (error) {
        console.error('Order cancellation failed:', error); // 打印错误到控制台
        ctx.status = 400;
        ctx.body = { message: 'Order cancellation failed', error: error.message };
    }
};

exports.successOrder = async (ctx) => {
    const { orderId } = ctx.params;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            ctx.status = 404;
            ctx.body = { message: 'Order not found' };
            return;
        }
        order.status = 'paid';
        await order.save();
        await redisClient.del(`order:${orderId}`);
        ctx.body = { message: 'Order paid successfully', order };
    } catch (error) {
        console.error('Order paid failed:', error); // 打印错误到控制台
        ctx.status = 400;
        ctx.body = { message: 'Order paid failed', error: error.message };
    }
};

exports.getUserOrders = async (ctx) => {
    const userId = ctx.state.userId; // 从 ctx.state 中获取 userId
    try {
        const orders = await Order.findAll({
            where: { UserId: userId },
            include: [
                {
                    model: OrderItem,
                    include: [Product],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        ctx.body = { orders };
    } catch (error) {
        console.error('Failed to get user orders:', error);
        ctx.status = 400;
        ctx.body = { message: 'Failed to get user orders', error: error.message };
    }
};

async function getOrderNumber() {
    const date = new Date().toISOString().slice(0, 10);
    const key = `orderNumber:${date}`;
    const count = await redisClient.incr(key);
    await redisClient.expire(key, 24 * 60 * 60); // expire key after 24 hours
    return count;
}
