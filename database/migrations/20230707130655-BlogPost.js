'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.BlogPosts, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lang: {
        type: Sequelize.STRING(2),
        allowNull: false,
        defaultValue: 'en',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      announce: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

    await queryInterface.addIndex(tables.BlogPosts, ['url', 'lang'], {
      unique: true,
    });

    await queryInterface.addIndex(tables.BlogPosts, ['active']);
    await queryInterface.addIndex(tables.BlogPosts, ['url']);
    await queryInterface.addIndex(tables.BlogPosts, ['createdAt']);
    await queryInterface.addIndex(tables.BlogPosts, ['publishedAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.BlogPosts);
  },
};
