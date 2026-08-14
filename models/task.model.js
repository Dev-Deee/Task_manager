const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title cannot be empty' },
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'tasks',
    timestamps: true,   // gives you createdAt + updatedAt automatically
    updatedAt: true,
});

module.exports = Task;