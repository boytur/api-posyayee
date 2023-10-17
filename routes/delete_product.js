/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ database
  
  DATE : 29/กันยายน/2023
  OWNER : piyawat W.

*/

const express = require('express');
const router = express.Router();
const {delete_product} = require('../controller/con_delete_product');

router.delete('/delete-product/:_id',delete_product)

module.exports = router;
