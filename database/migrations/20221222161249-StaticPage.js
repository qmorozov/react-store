'use strict';
const tables = require('../../src/app/database/tables.json');
const languages = require('../config/languages');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.StaticPage, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      ...languages.column('title', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      }),
      ...languages.column('content', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      }),
    });
    await queryInterface.addIndex(tables.StaticPage, ['url', 'status'], {
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.StaticPage);
  },
};
