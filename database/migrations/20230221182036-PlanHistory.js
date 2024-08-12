'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tables.PlanHistory, {
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
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      foreignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      planId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      until: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
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
      features: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.addIndex(tables.PlanHistory, ['type', 'foreignId']);
    await queryInterface.addIndex(tables.PlanHistory, ['type', 'foreignId', 'until']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.PlanHistory);
  },
};
