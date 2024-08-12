'use strict';
const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Brands, {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      showOnMain: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
    await queryInterface.addIndex(tables.Brands, ['showOnMain']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.Brands);
  },
};
