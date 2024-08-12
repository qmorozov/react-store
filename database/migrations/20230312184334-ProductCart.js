'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.ProductCart, {
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
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      suggestedStatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      suggestedPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      suggestedPriceCurrency: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex(tables.ProductCart, ['userId', 'productId'], {
      unique: true,
    });
    await queryInterface.addIndex(tables.ProductCart, ['userId']);
    await queryInterface.addIndex(tables.ProductCart, ['productId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductCart);
  },
};
