/*
  สร้าง Routes เพื่อนำทางไปเพิ่มสินค้าที่ database
  
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */

const express = require("express");
const router = express.Router();
const { con_dailysale } = require("../controller/con_dailysale");

router.get("/view-dailysale", con_dailysale);
module.exports = router;
