'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Reviews, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: tables.Orders,
          key: 'id',
        },
      },
      sellerType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      comment: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex(tables.Reviews, ['userId', 'orderId'], {
      unique: true,
    });
    await queryInterface.addIndex(tables.Reviews, ['sellerType', 'sellerId', 'orderId'], {
      unique: true,
    });
    await queryInterface.addIndex(tables.Reviews, ['sellerType', 'sellerId']);
    await queryInterface.addIndex(tables.Reviews, ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.Reviews);
  },
};
