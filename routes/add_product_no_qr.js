/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ไม่มีบาร์โค้ดที่ database
  
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */
const express = require('express');
const router = express.Router();
const {add_product_no_qr} = require('../controller/con_add_pr_no_qr')

/* สร้าง route สำหรับ /add-product-no-qr
   และเรียกใช้ controller con_add_pr_no_qr 
   เพื่อใช้งานการเพิ่มสินค้าที่ไม่มี barcode
*/
router.post('/add-product-no-qr', add_product_no_qr) 

module.exports = router;