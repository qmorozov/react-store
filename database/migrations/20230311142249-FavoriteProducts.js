'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.FavoriteProducts, {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: tables.Products,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });

    await queryInterface.addIndex(tables.FavoriteProducts, ['userId', 'productId'], {
      unique: true,
    });
    await queryInterface.addIndex(tables.FavoriteProducts, ['userId']);
    await queryInterface.addIndex(tables.FavoriteProducts, ['productId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.FavoriteProducts);
  },
};
