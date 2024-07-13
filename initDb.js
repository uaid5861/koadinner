const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product'); // 导入 Product 模型
const Category = require('./models/Category');
async function initDb() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Unable to create database:', error);
    }
}

initDb();
