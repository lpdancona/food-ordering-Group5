const db = require('../connection');

const getOrders = () => {
  return db.query(`
    SELECT o.*, u.name FROM orders o
    JOIN users u ON u.id = o.user_id
    ;`)
    .then(data => {
      return data.rows;
    });
};

const getOrderDishes = (order) => {
  return db.query(`
    SELECT od.*, d.name
    FROM order_dishes od
    JOIN dishes d ON d.id = od.dish_id
    WHERE od.order_id = $1;
    `, [order])
    .then(data => {
      return data.rows;
    });
};

module.exports = { getOrders, getOrderDishes };
