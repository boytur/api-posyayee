const express = require('express');
const router = express.Router();
const { add_product_quantity} = require('../controller/con_add_product_quantity'); // Import the controller function

router.post('/add-product-quantity', add_product_quantity);

module.exports = router;
