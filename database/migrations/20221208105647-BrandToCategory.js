'use strict';
const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      tables.BrandToCategory,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        brandId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: tables.Brands,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        categoryId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: tables.Category,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        isPopular: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        uniqueKeys: {
          uniqueCategoryBrands: {
            fields: ['categoryId', 'brandId'],
          },
        },
      },
    );
    await queryInterface.addIndex(tables.BrandToCategory, ['isPopular']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tables.BrandToCategory);
  },
};
