const express = require('express');
const AddProduct = require('../schema/product_schema');
const app = express();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadToB2 = require('../middleware/uploadB2');
const product_schema = require('../schema/product_schema');

app.post('/edit-product', upload.single('image'), async (req, res) => {
  const fileName = generateFileName();
  const imageURLs = req.file ? `${process.env.URL}${fileName}` : 'https://placehold.co/600x400/EEE/31343C';

  editProduct(req.body, imageURLs, res, req)
  if (!req.file) {
    console.log('Image not found!');
  } else {
    await uploadToB2(req.file.buffer, fileName, res);
  }

  async function editProduct(productData, imageURLs, res, req) {
    try {
      //validate ข้อมูลก่อนส่งแก้ไข
      switch (true) {
        case !productData._id:
          return res.status(400).json({
            error: "เกิดข้อผิดพลาดกับสินค้าไอดีนี้",
          });
        case !productData.name:
          return res.status(400).json({
            error: "กรุณาใส่ชื่อสินค้า",
          });
        case productData.volume <= -1 || productData.price <= 0:
          return res.status(400).json({
            error: "อย่าใส่ค่าติดลบมาโว้ยยยลำบากมาเขียน validate เนี่ย",
          });
      }

      //หาว่ามีชื่อซํ้าไหม
      const existingProduct = await product_schema.findOne({ name: productData.name });
      if (existingProduct) {
        return res.status(400).json({
          error: "สินค้าชื่อนี้มีอยู่ในคลังแล้ว",
        });
      } else {
        const updatedProduct = await product_schema.updateOne(
          { _id: new ObjectId(productData._id) }, //แปลง id_ ที่รับมาให้เป็น Objet
          {
            name: productData.name,
            image: imageURLs,
            price: productData.price,
            volume: productData.volume,
          },
          { new: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({
            error: "ไม่เจอสินค้า",
          });
        }

        res.status(200).send({
          success: true,
          msg: "แก้ไขข้อมูลสินค้าเรียบร้อยค่ะ!"
        })
      }
    }
    catch (err) {
      console.error(err);
    }
  }
  function generateFileName() {
    return `img${Date.now()}`;
  }
});

module.exports = app;