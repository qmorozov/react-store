'use strict';

const tables = require('../../src/app/database/tables.json');
const productAttributes = require('../config/productAttributes');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesNaturalDiamonds, {
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
      cut: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      clarity: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      colorGrade: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      carat: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      shape: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      fluorescence: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      lwRatio: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      cutScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      table: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      depth: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesNaturalDiamonds);
  },
};
