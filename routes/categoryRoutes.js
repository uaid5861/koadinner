const Router = require('koa-router');
const categoryController = require('../controllers/categoryController');

const router = new Router();

router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getCategories);

module.exports = router;
