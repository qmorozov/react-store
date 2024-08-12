'use strict';

const tables = require('../../src/app/database/tables.json');
const productAttributes = require('../config/productAttributes');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesCoin, {
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
      theme: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      par: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      peculiarities: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      circulation: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      countryOfOrigin: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      denomination: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      collection: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      certificate: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      stateReward: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      comesWithPacking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      packingMaterial: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      packingSize: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesCoin);
  },
};
