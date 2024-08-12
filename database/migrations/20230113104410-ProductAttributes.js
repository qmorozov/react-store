'use strict';
const tables = require('../../src/app/database/tables.json');
const languages = require('../config/languages');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.ProductAttributes, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attribute: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ...languages.column('name', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    });
    await queryInterface.addIndex(tables.ProductAttributes, ['productType']);
    await queryInterface.addIndex(tables.ProductAttributes, ['productType', 'attribute']);
    await queryInterface.addIndex(tables.ProductAttributes, ['productType', 'attribute', 'value'], {
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.ProductAttributes);
  },
};
