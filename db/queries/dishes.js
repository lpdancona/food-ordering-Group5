const db = require('../connection');

const getDishes = () => {
  return db.query('SELECT * FROM dishes;')
    .then(data => {
      return data.rows;
    });
};

const getCategoryDishes = (category) => {
  return db.query('SELECT * FROM dishes WHERE category LIKE $1;', [category])
    .then(data => {
      return data.rows;
    });
};

module.exports = { getDishes, getCategoryDishes };
