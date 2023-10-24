/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ database
  
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */

const express = require("express");
const router = express.Router();
const { con_register } = require("../auth/con_register"); // Import the controller Auth

router.post("/register", con_register);
module.exports = router;
