// Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
    orderNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // 'pending', 'paid', 'cancelled'
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

Order.belongsTo(User);
User.hasMany(Order);

module.exports = Order;
