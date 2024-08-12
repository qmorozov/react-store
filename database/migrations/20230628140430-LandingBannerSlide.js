'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.LandingBannerSlide, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex(tables.LandingBannerSlide, ['active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.LandingBannerSlide);
  },
};
