/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ database
  
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */

  const express = require("express");
  const router = express.Router();
  const { con_sale} = require("../controller/con_sale");
  
  router.post("/sale", con_sale);
  module.exports = router;
  