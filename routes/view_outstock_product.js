/*
  สร้าง Routes เพื่อนำทางไปดูสินค้าที่ใกล้หมด
  ที่ controller con_view_pr_no_qr 
  DATE : 28/กันยายน/2023
  OWNER : piyawat W. 
*/
const express = require('express');
const router = express.Router();
const {view_outstock_product} = require('../controller/con_view_outstock');

/* สร้าง route สำหรับ /view-product-no-qr
   และเรียกใช้ controller con_view_pr_no_qr 
   เพื่อใช้งานการดูสินค้าที่ไม่มี barcode
*/

router.get('/view-outstock-product', view_outstock_product);
//export router ไปใช้
module.exports = router;