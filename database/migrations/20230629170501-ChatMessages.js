'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.ChatMessage, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: tables.Chats,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      senderType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: tables.Products,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.addIndex(tables.ChatMessage, ['chatId']);
    await queryInterface.addIndex(tables.ChatMessage, ['productId']);
    await queryInterface.addIndex(tables.ChatMessage, ['updatedAt']);

    await queryInterface.addConstraint(tables.Chats, {
      type: 'foreign key',
      name: 'fk_chats_last_message_id',
      references: {
        table: tables.ChatMessage,
        field: 'id',
      },
      fields: ['lastMessageId'],
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ChatMessage);
  },
};
