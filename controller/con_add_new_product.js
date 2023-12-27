const express = require('express');
const AddProduct = require('../schema/product_schema');
const app = express();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadToB2 = require('../middleware/uploadB2');

app.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const fileName = generateFileName();
    const imageURLs = req.file ? `${process.env.URL}${fileName}` : 'https://placehold.co/600x400/EEE/31343C';

    await addNewProduct(req.body, imageURLs, res, req);

    if (!req.file) {
      console.log('Image not found!');
    } else {
      await uploadToB2(req.file.buffer, fileName, res);
    }

  } catch (err) {
    console.log('Error:', err);
    res.status(500).send({
      success: false,
      msg: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้งค่ะ!'
    });
  }
});

function generateFileName() {
  return `img${Date.now()}`;
}

async function addNewProduct(productData, imageURLs, res, req) {
  try {
    const { name, price, volume, barcode } = productData;

    if (!name || !price) {
      return res.status(400).json({
        error: 'กรุณาใส่ชื่อและราคาสินค้าค่ะ!',
      });
    }

    const newProduct = new AddProduct({
      name: name,
      image: imageURLs,
      price: price,
      volume: volume,
      barcode: barcode
    });

    const existingProduct = await AddProduct.findOne({ name: name });

    if (existingProduct) {
      return res.status(400).json({
        error: 'สินค้าชื่อนี้มีอยู่แล้วค่ะ!',
      });
    }

    if (barcode !== '') {
      const existingBarcodeProduct = await AddProduct.findOne({
        barcode: barcode,
      });

      if (existingBarcodeProduct) {
        return res.status(400).json({
          error: 'สินค้าบาร์โค้ดนี้มีอยู่แล้ว',
        });
      }
    }

    const savedProduct = await newProduct.save();
    // ทำการ response ก่อนที่จะทำ uploadToB2
    res.status(201).json({
      success: true,
      message: `${name} ถูกเพิ่มแล้วค่ะ`
    });

  } catch (err) {
    console.log('Error adding new product:', err);
    throw err;
  }
}
module.exports = app;