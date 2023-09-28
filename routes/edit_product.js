/*
  สร้าง Routes เพื่อนำทางไปแก้ไขสินค้า database
  
  DATE : 28กันยายน/2023
  OWNER : piyawat W. 
*/

const express = require('express');
const router = express.Router();
const { edit_product} = require('../controller/con_edit_product'); // Import the controller function

router.post('/edit-product', edit_product);

module.exports = router;