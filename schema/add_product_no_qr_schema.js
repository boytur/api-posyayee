/*
  สร้าง schema เพื่อเป็นโครงสร้างการเก็บข้อมูลสินค้าแบบไม่มี barcode 
  name: ชื่อของสินค้า (String)
  image: ชื่อไฟล์รูปภาพของสินค้า (String)
  price: ราคาของสินค้า (Double)
  volume: ปริมาณของสินค้า (Number)
  dateAdded: วันที่เพิ่มสินค้า (Date) ที่กำหนดค่าเริ่มต้นเป็นวันที่ปัจจุบัน.

  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */

const mongoose = require('mongoose');

// สร้าง schema
const add_product_no_qr = mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  image:{
    type:String,
    default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fplaceholder-image&psig=AOvVaw33j60GE0bSQiB2duaI1FK9&ust=1695886181383000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCIDpq72iyoEDFQAAAAAdAAAAABAQ"
  },
  price:{
    type:Number,
    required:true
  },
  volume:{
    type:Number,
    required:true
  }
},{timestamps:true});

// สร้าง model จาก schema
module.exports = mongoose.model("AddProductNoQr",add_product_no_qr,"ProductsNoQr");//(ฟังก์ชัน ,ตาราง ,ชื่อในdatabase)