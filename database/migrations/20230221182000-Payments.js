'use strict';
const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.Payments, {
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
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'usd',
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'requires_payment_method',
      },
      paymentIntent: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      paymentClientSecret: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
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

    await queryInterface.addIndex(tables.Payments, {
      fields: ['type'],
    });

    await queryInterface.addIndex(tables.Payments, {
      fields: ['paymentStatus'],
    });

    await queryInterface.addIndex(
      tables.Payments,
      {
        fields: ['paymentIntent', 'paymentClientSecret'],
      },
      {
        unique: true,
      },
    );

    await queryInterface.addIndex(tables.Payments, {
      fields: ['createdAt'],
    });

    await queryInterface.addIndex(tables.Payments, {
      fields: ['updatedAt'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.Payments);
  },
};
