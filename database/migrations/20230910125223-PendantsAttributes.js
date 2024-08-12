'use strict';

const productAttributes = require('../config/productAttributes');
const tables = require('../../src/app/database/tables.json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesPendants, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: tables.Products,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      coating: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      material: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      gemstonesQuantity: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      gemstones: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      mixedStones: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      largeStones: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gemstoneColor: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      incut: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      incutColor: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      packing: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesPendants);
  },
};
