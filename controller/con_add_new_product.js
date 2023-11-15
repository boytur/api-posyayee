const express = require('express');
const AddProduct = require("../schema/add_product_schema");
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });
app.use(express.static('uploads'));

exports.add_new_product = async (req, res) => {
  const { name, price, volume, barcode } = req.body;
  const fileName = req.file ? req.file.filename : null;
  console.table({ name, fileName });  

  // validate ข้อมูลก่อนบันทึกลงฐานข้อมูล
  switch (true) {
    case !name:
      return res.status(400).json({
        error: "กรุณาใส่ชื่อสินค้า",
      });
      break;
    case !price:
      return res.status(400).json({
        error: "กรุณาใส่ราคาสินค้า",
      });
      break;
  }

  try {
    // สร้าง object สินค้าใหม่จาก schema
    const newProduct = new AddProduct({
      name: name,
      image: fileName, // เก็บเฉพาะชื่อไฟล์
      price: price,
      volume: volume,
      barcode: barcode,
    });

    // ตรวจสอบว่ามีสินค้าที่มีชื่อเดียวกันอยู่แล้วหรือไม่
    const existingProduct = await AddProduct.findOne({ name: name });

    if (existingProduct) {
      return res.status(400).json({
        error: "สินค้าชื่อนี้มีอยู่แล้ว",
      });
    }

    // ถ้ามีการระบุบาร์โค้ด ตรวจสอบว่าไม่ซ้ำ
    if (barcode !== '') {
      const existingBarcodeProduct = await AddProduct.findOne({
        barcode: barcode,
      });
      if (existingBarcodeProduct) {
        return res.status(400).json({
          error: "สินค้าบาร์โค้ดนี้มีอยู่แล้ว",
        });
      }
    }

    if (volume === null || parseInt(volume) <= 0) {
      volume = null;
      return res.status(400).json({
        error: "กรุณาใส่จำนวนที่ถูกต้อง",
      });
    }

    // บันทึกสินค้าลงฐานข้อมูล
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: `${name} ถูกเพิ่มแล้ว`, productId: savedProduct._id });
  } catch (error) {
    // ตรวจสอบ error และจัดการตามนั้น
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง", details: error.message });
    }
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์กรุณาลองใหม่อีกครั้ง" });
  }
};