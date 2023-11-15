/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ database
  
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */


  const express = require('express');
  const router = express.Router();
  const multer = require('multer');
  const { add_new_product } = require('../controller/con_add_new_product');
  
  // กำหนดการเก็บรูป
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });
  
  // สร้าง middleware สำหรับการอัปโหลดไฟล์
  const upload = multer({ storage: storage });
  
  router.post('/add-product', upload.single('file'), add_new_product);
  
  module.exports = router;