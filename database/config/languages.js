const languages = require('../../src/translation/config.json');

const list = Object.keys(languages || { en: true });

module.exports = {
  list,
  column(name, parameters) {
    const column = {};
    list.forEach((language) => {
      column[`${name}_${language}`] = parameters;
    });
    return column;
  },
};
