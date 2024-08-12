'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Chats, {
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
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ownerType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      addresseeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      addresseeType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lastMessageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
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

    await queryInterface.addIndex(tables.Chats, ['ownerId', 'ownerType', 'addresseeId', 'addresseeType'], {
      unique: true,
    });

    await queryInterface.addIndex(tables.Chats, ['addresseeId', 'addresseeType', 'ownerId', 'ownerType'], {
      unique: true,
    });

    await queryInterface.addIndex(tables.Chats, ['lastMessageId']);
    await queryInterface.addIndex(tables.Chats, ['updatedAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.Chats);
  },
};
