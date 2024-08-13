// models/Notes.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Notes = sequelize.define('Notes', {
    // Define attributes
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deletedBy: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.ENUM('active', 'priority', 'inactive'),
        defaultValue: 'active'
    }
}, {
    paranoid: true // Enable soft delete
});

module.exports = Notes;
