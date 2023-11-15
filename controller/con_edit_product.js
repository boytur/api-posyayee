/*
 เมื่อมี req มาจาก routes edit-products
 ให้แก้ไขข้อมูลลงใน database ผ่านโครงสร้าง schema
  DATE : 28/กันยายน/2023
  OWNER : piyawat W. 
*/

/*เพื่อแปลง _id ที่รับมาเป็น String จาก user ให้เป็น Objet เพราะ MongoDB
    ซัพพอร์ตแค่ Object
*/

const express = require('express');
const { ObjectId } = require('mongodb');
const EditProduct = require("../schema/add_product_schema");
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

exports.edit_product = async (req, res) => {
  const { _id, name, price, volume } = req.body;
  const fileName = req.file ? req.file.filename : null;
  console.table({ name, fileName , name , price , volume});  

  //validate ข้อมูลก่อนส่งแก้ไข
  switch (true) {
    case !_id:
      return res.status(400).json({
        error: "เกิดข้อผิดพลาดกับสินค้าไอดีนี้",
      });
      break;
    case !name:
      return res.status(400).json({
        error: "กรุณาใส่ชื่อสินค้า",
      });
      break;
    case volume <= -1 || price <= 0:
        return res.status(400).json({
          error: "อย่าใส่ค่าติดลบมาโว้ยยยลำบากมาเขียน validate เนี่ย",
    });
      break;
  }
  
  //หาว่ามีชื่อซํ้าไหม
  const existingProduct = await EditProduct.findOne({ name: name });
  if (existingProduct) {
    return res.status(400).json({
      error: "สินค้าชื่อนี้มีอยู่ในคลังแล้ว",
    });
  } else {
    //ถ้าไม่ให้บันทึกข้อมูลลง database
    try {
      const updatedProduct = await EditProduct.updateOne(
        {_id:new ObjectId(_id)}, //แปลง id_ ที่รับมาให้เป็น Objet
        {
          name: name,
          image: fileName,
          price: price,
          volume: volume,
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          error: "ไม่เจอสินค้า",
        });
      }

      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
      });
    }
  }
};