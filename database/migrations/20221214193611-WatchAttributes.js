'use strict';

const tables = require('../../src/app/database/tables.json');
const productAttributes = require('../config/productAttributes');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await productAttributes.createTable(queryInterface, tables.ProductAttributesWatch, {
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
      version: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      body_material: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      combined_materials: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      color_of_body: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      coating: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      body_shape: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      water_protection: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      dial_color: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      bracelet_or_strap: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      type_of_indication: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      material: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      mechanism_type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      glass: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.ProductAttributesWatch);
  },
};
