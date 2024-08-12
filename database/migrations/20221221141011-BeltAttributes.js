'use strict';

const tables = require('../../src/app/database/tables.json');
const productAttributes = require('../config/productAttributes');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesBelt, {
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
      belt_length: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      material: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      combined_materials: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      clasp: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesBelt);
  },
};
