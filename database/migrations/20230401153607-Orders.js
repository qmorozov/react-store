'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Orders, {
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
      sellerType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      products: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      totalProducts: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      delivery: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      shipping: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      contacts: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: tables.Payments,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex(tables.Orders, ['userId', 'paymentId'], {
      unique: true,
    });
    await queryInterface.addIndex(tables.Orders, ['status']);
    await queryInterface.addIndex(tables.Orders, ['userId']);
    await queryInterface.addIndex(tables.Orders, ['sellerType', 'sellerId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.Orders);
  },
};
