'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Shop, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        defaultValue: null,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      rating: {
        type: Sequelize.FLOAT(2, 1),
        allowNull: false,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      formOfOrganization: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      vatNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      productsSold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      registrationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.Shop);
  },
};
