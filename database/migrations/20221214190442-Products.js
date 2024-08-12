'use strict';

const tables = require('../../src/app/database/tables.json');

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      tables.Products,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        baseProductId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
          references: {
            model: tables.Products,
            key: 'id',
          },
        },
        type: {
          type: Sequelize.STRING,
          index: true,
          allowNull: true,
          defaultValue: null,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        approved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        canSuggestPrice: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        url: {
          type: Sequelize.CHAR(36),
          allowNull: false,
          unique: true,
        },
        rating: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        ownerType: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ownerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        year: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        brandId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
          references: {
            model: tables.Brands,
            key: 'id',
          },
        },
        model: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        condition: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        sex: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        currency: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        serialNumber: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        referenceNumber: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        customFeatures: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        cover: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        images: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        uniqueKeys: {
          unique_product: {
            fields: ['url', 'type'],
          },
        },
      },
    );
    await queryInterface.addIndex(tables.Products, ['type']);
    await queryInterface.addIndex(tables.Products, ['model']);
    await queryInterface.addIndex(tables.Products, ['baseProductId']);
    await queryInterface.addIndex(tables.Products, ['status']);
    await queryInterface.addIndex(tables.Products, ['condition']);
    await queryInterface.addIndex(tables.Products, ['quantity']);
    await queryInterface.addIndex(tables.Products, ['ownerType', 'ownerId']);
    await queryInterface.addIndex(tables.Products, ['brandId']);
    await queryInterface.addIndex(tables.Products, ['sex']);
    await queryInterface.addIndex(tables.Products, ['price']);
    await queryInterface.addIndex(tables.Products, ['serialNumber']);
    await queryInterface.addIndex(tables.Products, ['referenceNumber']);
    await queryInterface.addIndex(tables.Products, ['title', 'model', 'serialNumber', 'referenceNumber'], {
      type: 'FULLTEXT',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tables.Products);
  },
};
