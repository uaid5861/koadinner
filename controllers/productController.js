const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (ctx) => {
    const { name, price, stock, img, categoryId } = ctx.request.body;
    try {
        const category = await Category.findByPk(categoryId);

        if (!category) {
            ctx.status = 404;
            ctx.body = { message: 'Category not found' };
            return;
        }

        const product = await Product.create({ name, price, stock, img, CategoryId: categoryId });
        ctx.body = { message: 'Product created successfully', product };
    } catch (error) {
        ctx.status = 400;
        ctx.body = { message: 'Product creation failed', error };
    }
};

exports.getProducts = async (ctx) => {
    const { categoryId } = ctx.query;
    try {
        const whereClause = { isAvailable: true };
        if (categoryId) {
            whereClause.CategoryId = categoryId;
        }
        const products = await Product.findAll({ where: whereClause });
        ctx.body = { products };
    } catch (error) {
        ctx.status = 400;
        ctx.body = { message: 'Failed to fetch products', error };
    }
};

exports.updateProduct = async (ctx) => {
    const { id } = ctx.params;
    const { name, price, stock, img, isAvailable } = ctx.request.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            ctx.status = 404;
            ctx.body = { message: 'Product not found' };
            return;
        }
        await product.update({ name, price, stock, img, isAvailable });
        ctx.body = { message: 'Product updated successfully', product };
    } catch (error) {
        ctx.status = 400;
        ctx.body = { message: 'Product update failed', error };
    }
};
