/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ database
  
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */

const express = require("express");
const router = express.Router();
const { con_login } = require("../auth/con_login"); // Import the controller Auth

router.post("/login", con_login);
module.exports = router;
