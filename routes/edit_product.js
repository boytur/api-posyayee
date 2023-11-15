/*
  สร้าง Routes เพื่อนำทางไปแก้ไขสินค้า database
  
  DATE : 28กันยายน/2023
  OWNER : piyawat W. 
*/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { edit_product } = require('../controller/con_edit_product'); // Import the controller function

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

router.post('/edit-product', upload.single('file'), edit_product);
module.exports = router;