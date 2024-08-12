'use strict';

const productAttributes = require('../config/productAttributes');
const tables = require('../../src/app/database/tables.json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesCufflinks, {
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
        type: Sequelize.INTEGER,
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
      gemstoneType: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      gemstonesQuantity: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      engraving: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cufflinkQuantity: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      shape: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      textured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
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
    await queryInterface.dropTable(tables.ProductAttributesCufflinks);
  },
};
