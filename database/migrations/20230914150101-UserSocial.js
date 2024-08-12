'use strict';
const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.UserSocials, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: tables.Users,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      socialId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.addIndex(tables.UserSocials, ['type', 'socialId'], {
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.UserSocials);
  },
};
