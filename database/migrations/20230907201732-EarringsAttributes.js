'use strict';

const productAttributes = require('../config/productAttributes');
const tables = require('../../src/app/database/tables.json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesEarrings, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: tables.Products,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      material: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      gem: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      vintage: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
      proofOfOrigin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      originalCase: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cardOrCertificate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesEarrings);
  },
};
