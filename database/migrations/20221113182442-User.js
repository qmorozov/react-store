'use strict';
const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Users, {
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
      role: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      verificationCode: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
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
      productsSold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.Users);
  },
};
