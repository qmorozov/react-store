'use strict';

const tables = require('../../src/app/database/tables.json');
const productAttributes = require('../config/productAttributes');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesWallet, {
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
      clasp: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      number_of_compartments_for_bills: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      number_of_compartments_for_cards: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesWallet);
  },
};
