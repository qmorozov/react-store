'use strict';

const productAttributes = require('../config/productAttributes');
const tables = require('../../src/app/database/tables.json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesPens, {
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
      bodyColor: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      bodyMaterial: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      combined_materials: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      inkColor: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      inkReplaceable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      engraving: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      vintage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rare: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      awardCommemorative: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      comesWithPacking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      originalCase: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tags: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesPens);
  },
};
