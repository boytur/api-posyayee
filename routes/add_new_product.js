/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ database
  
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */


const express = require('express');
const router = express.Router();
const { add_new_product} = require('../controller/con_add_new_product'); // Import the controller function

router.post('/add-product', add_new_product);

module.exports = router;
