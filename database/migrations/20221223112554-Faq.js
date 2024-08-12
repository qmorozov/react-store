'use strict';
const tables = require('../../src/app/database/tables.json');
const languages = require('../config/languages');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Faq, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: tables.Faq,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      ...languages.column('title', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      }),
      ...languages.column('answer', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      }),
    });
    await queryInterface.addIndex(tables.Faq, ['parentId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.Faq);
  },
};
