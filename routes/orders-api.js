const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/orders');

const accountSid = "AC2e20704dd16f07396b3fa291a50f0dcf";
const authToken = "7937a0f800d5bfa091224215bf0c4268";
const client = require("twilio")(accountSid, authToken);

const clientSMS = function(id, time) {
  client.messages
    .create({
      body: `Your order #${id} will be ready for pickup at ${time}`,
      from: "+13307719275",
      to: "+14037085843",
    })
    .then((message) => console.log(message.sid))
    .catch(e => { console.error('Got an error:', e.code, e.message); });
};

const restaurantSMS = function() {
  client.messages
    .create({
      body: `New order was placed`,
      from: "+13307719275",
      to: "+14037085843",
    })
    .then((message) => console.log(message.sid))
    .catch(e => { console.error('Got an error:', e.code, e.message); });
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
      console.log('post method was called');
      clientSMS(req.body.id, req.body.time);
      res.json({ orders });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/', (req, res) => {
  console.log('req.body', req.body);
  orderQueries.placeOrder('1', '1', req.body)
    .then(orders => {
      restaurantSMS();
      res.json({ orders });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
