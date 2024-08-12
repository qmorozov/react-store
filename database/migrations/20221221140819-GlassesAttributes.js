'use strict';

const tables = require('../../src/app/database/tables.json');
const productAttributes = require('../config/productAttributes');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesGlasses, {
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
      lenses_color: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      frame_color: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      frame_material: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      frame_shape: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesGlasses);
  },
};
