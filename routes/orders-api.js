const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/orders');

const accountSid = "AC2e20704dd16f07396b3fa291a50f0dcf";
const authToken = "03953c38c0a457517e13a9d5ca463487";
const client = require("twilio")(accountSid, authToken);

const restaurantSMS = function(id, time) {
  client.messages
    .create({
      body: `Your order #${id} will be ready for pickup at ${time}`,
      from: "+13307719275",
      to: "+17788364271",
    })
    .then((message) => console.log(message.sid));
};

router.get('/', (req, res) => {
  orderQueries.getOrders()
    .then(orders => {
      res.json({ orders });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
  orderQueries.getOrderDishes(req.params['id'])
    .then(dishes => {
      res.json({ dishes });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/:id', (req, res) => {
  orderQueries.updateOrder(req.body.id, req.body.time)
    .then(orders => {
      console.log('post api');
      restaurantSMS(req.body.id, req.body.time);
      res.json({ orders });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
