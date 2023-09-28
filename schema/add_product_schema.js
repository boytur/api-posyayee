/*
  สร้าง schema เพื่อเป็นโครงสร้างการเก็บข้อมูลสินค้าแบบไม่มี barcode 
  name: ชื่อของสินค้า (String)
  image: ชื่อไฟล์รูปภาพของสินค้า (String)
  price: ราคาของสินค้า (Double)
  barcode: บาร์โค้ดสินค้า
  volume: ปริมาณของสินค้า (Number)
  dateAdded: วันที่เพิ่มสินค้า (Date) ที่กำหนดค่าเริ่มต้นเป็นวันที่ปัจจุบัน.
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */

const mongoose = require('mongoose');

// สร้าง schema
const add_product = mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  image:{
    type:String,
    default:"https://placehold.co/600x400"
  },
  price:{
    type:Number,
    required:true
  },
  barcode:{
    type:String,
    default:null
  },
  volume:{
    type:Number,
    default:-1
  }
},{timestamps:true});

// สร้าง model จาก schema
module.exports = mongoose.model("AddProduct",add_product,"Products");//(ฟังก์ชัน ,ตาราง ,ชื่อในdatabase)