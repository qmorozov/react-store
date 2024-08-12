'use strict';
const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Sessions, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: tables.Users,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      deviceName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.Sessions);
  },
};
