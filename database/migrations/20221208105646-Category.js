'use strict';
const tables = require('../../src/app/database/tables.json');
const languages = require('../config/languages');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      tables.Category,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        parentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: tables.Category,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        productType: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        ...languages.column('name', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        }),
        image: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        uniqueKeys: {
          uniqueCategory: {
            fields: ['parentId', 'url'],
          },
          productType: {
            fields: ['parentId', 'productType'],
          },
        },
      },
    );
    await queryInterface.addIndex(tables.Category, ['parentId']);
    await queryInterface.addIndex(tables.Category, ['productType']);
    await queryInterface.addIndex(tables.Category, ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.Category);
  },
};
