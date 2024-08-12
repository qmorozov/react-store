'use strict';

const productAttributes = require('../config/productAttributes');
const tables = require('../../src/app/database/tables.json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesJewellerySets, {
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
      necklace: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      earrings: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      brooch: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bracelet: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      diadem: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ring: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
      pendant: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      size: {
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
      materialCombined: {
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
      gemstonesMixedStones: {
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
    await queryInterface.dropTable(tables.ProductAttributesJewellerySets);
  },
};
