const Router = require('koa-router');
const productController = require('../controllers/productController');

const router = new Router();

router.post('/products', productController.createProduct);
router.get('/products', productController.getProducts);
router.put('/products/:id', productController.updateProduct)

module.exports = router;
