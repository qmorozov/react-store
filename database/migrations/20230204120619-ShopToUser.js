'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      tables.ShopToUser,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        shopId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: tables.Shop,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: tables.Users,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        role: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        uniqueKeys: {
          uniqueCategoryBrands: {
            fields: ['userId', 'shopId'],
          },
        },
      },
    );
    await queryInterface.addIndex(tables.ShopToUser, ['userId']);
    await queryInterface.addIndex(tables.ShopToUser, ['shopId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ShopToUser);
  },
};
