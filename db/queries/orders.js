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

const updateOrder = (order, ready_by) => {
  return db.query(`
    UPDATE orders
    SET ready_by = $2
    WHERE id = $1
    RETURNING *;
    `, [order, ready_by])
    .then(data => {
      return data.rows;
    });
};

const placeOrder = (user_id, restaurant_id, cart) => {
  let total = 0;
  for (const key in cart) {
    total += Number(cart[key].price) * Number(cart[key].qty);
  }

  return db.query(`
    INSERT INTO orders (user_id, total, restaurant_id)
    VALUES ($1, $2, $3) RETURNING *;
    `, [user_id, total, restaurant_id])
    .then(data => {
      // console.log(data.rows[0]);
      const id = data.rows[0].id;

      let str = `INSERT INTO order_dishes (order_id, dish_id, quantity)
      VALUES `;

      for (const key in cart) {
        str += `(${id}, ${key}, ${cart[key].qty}), `
      }

      str = str.slice(0, -2) + 'RETURNING *;';
      db.query(str)
        .then(data2 => {
          return data2.rows;
        });
      return data.rows[0];
    });
};

module.exports = { getOrders, getOrderDishes, updateOrder, placeOrder };
