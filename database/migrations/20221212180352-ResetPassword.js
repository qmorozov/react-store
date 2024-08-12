'use strict';
const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.ResetPassword, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: tables.Users,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      token: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.ResetPassword);
  },
};
