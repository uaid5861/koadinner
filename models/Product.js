const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');


const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },

});

// 建立关系
Product.belongsTo(Category);
Category.hasMany(Product);

module.exports = Product;
