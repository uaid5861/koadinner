const Category = require('../models/Category');

exports.createCategory = async (ctx) => {
    const { name } = ctx.request.body;
    try {
        const category = await Category.create({ name });
        ctx.body = { message: 'Category created successfully', category };
    } catch (error) {
        ctx.status = 400;
        ctx.body = { message: 'Category creation failed', error };
    }
};

exports.getCategories = async (ctx) => {
    try {
        const categories = await Category.findAll();
        ctx.body = { categories };
    } catch (error) {
        ctx.status = 400;
        ctx.body = { message: 'Failed to fetch categories', error };
    }
};
