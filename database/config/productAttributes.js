async function addIndexes(attributes, callback) {
  return Promise.all(
    Object.keys(attributes).map((key) => {
      if (['id', 'productId'].includes(key)) return Promise.resolve();
      return callback(key);
    }),
  );
}

module.exports = {
  async createTable(queryInterface, tableName, attributes) {
    await queryInterface.createTable(tableName, attributes);
    await addIndexes(attributes, (key) => {
      return queryInterface.addIndex(tableName, [key]);
    });
  },
};
