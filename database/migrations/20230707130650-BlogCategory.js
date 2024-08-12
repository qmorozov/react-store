'use strict';

const tables = require('../../src/app/database/tables.json');
const languages = require('../config/languages');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.BlogCategories, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ...languages.column('name', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      }),
    });

    await queryInterface.addIndex(tables.BlogCategories, ['status']);
    await queryInterface.addIndex(tables.BlogCategories, ['url'], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.BlogCategories);
  },
};
