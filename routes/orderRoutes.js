// orderRoutes.js
const Router = require('koa-router');
const orderController = require('../controllers/orderController');

const router = new Router();

router.post('/orders', orderController.placeOrder);
router.put('/orders/cancel/:orderId', orderController.cancelOrder);
router.put('/orders/paid/:orderId', orderController.successOrder);
router.get('/orders', orderController.getUserOrders); 

module.exports = router;
