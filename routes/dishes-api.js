const express = require('express');
const router  = express.Router();
const dishQueries = require('../db/queries/dishes');

router.get('/', (req, res) => {
  dishQueries.getDishes()
    .then(dishes => {
      res.json({ dishes });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/:category', (req, res) => {
  dishQueries.getCategoryDishes(req.params['category'])
    .then(dishes => {
      res.json({ dishes });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
