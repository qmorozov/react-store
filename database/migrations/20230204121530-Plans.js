'use strict';

const tables = require('../../src/app/database/tables.json');
const languages = require('../config/languages');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Plans, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ...languages.column('title', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      ...languages.column('description', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      }),
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price_month: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      price_year: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'usd',
      },
      max_products: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex(tables.Plans, ['active']);
    await queryInterface.addIndex(tables.Plans, ['active', 'type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.Plans);
  },
};
