const express = require('express');
const AddProduct = require("../schema/add_product_schema");
const app = express();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const b2 = require("../services/b2");

app.post('/add-product', upload.single('image'), async (req, res) => {

  /* Generate file name */
  let fileName = generateFileName();
  let imageURLs = "";
  if (!req.file) {
    imageURLs = "https://placehold.co/600x400/EEE/31343C"
  }
  else {
    imageURLs = `https://f005.backblazeb2.com/file/posyayee/${fileName}`
  }
  
  /* FUCNTION B2 upload images */
  async function GetBucket() {
    try {
      await b2.authorize();
      let response = await b2.getBucket({ bucketName: 'posyayee' });
      // console.log(response);
      b2.getUploadUrl({
        bucketId: process.env.BUCKET_ID,
      }).then((uploadUrlResponse) => {
        // console.log("getUploadUrl", uploadUrlResponse.data.uploadUrl, uploadUrlResponse.data.authorizationToken);
        const fileBuffer = req.file.buffer;
        if (!fileBuffer) {
          throw new Error('File buffer is undefined.');
        }
        b2.uploadFile({
          uploadUrl: uploadUrlResponse.data.uploadUrl,
          uploadAuthToken: uploadUrlResponse.data.authorizationToken,
          fileName: fileName,
          data: fileBuffer,
          onUploadProgress: null,
        }).then((uploadFileResponse) => {
          // console.log('uploadFile', uploadFileResponse);
          console.log("publicUrl", imageURLs);
        });
      });
    } catch (err) {
      console.log('Error getting bucket:', err);
      res.status(500).send({
        result: false,
        msg: "Error getting bucket"
      })
    }
  }

  /* FUCNTION generate name */
  function generateFileName() {
    return `img` + Date.now();
  }

  /* FUCNTION Add product in database */
  addNewProductFucn = async () => {
    try {
      // validate data
      const { name, price, volume, barcode } = req.body;
      switch (true) {
        case !name:
          return res.status(400).json({
            error: "กรุณาใส่ชื่อสินค้าค่ะ",
          });
        case !price:
          return res.status(400).json({
            error: "กรุณาใส่ราคาสินค้าค่ะ",
          });
      }
      // create new object form schema
      const newProduct = new AddProduct({
        name: name,
        image: `${imageURLs}`,
        price: price,
        volume: volume,
        barcode: barcode,
      });

      // Check existing product
      const existingProduct = await AddProduct.findOne({ name: name });

      if (existingProduct) {
        return res.status(400).json({
          error: "สินค้าชื่อนี้มีอยู่แล้ว",
        });
      }

      // If product has barcode, verify existing product
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

      // Create a new product in database
      const savedProduct = await newProduct.save();
      res.status(201).json({
        message: `${name} ถูกเพิ่มแล้วค่ะ`,
        productId: savedProduct._id,
      });
      console.log(savedProduct);
    }
    catch (err) {
      console.log(err)
    }
  }

  /* Used function */

  //If image file undefined
  try {
    if (!req.file) {
      console.log("image not found!")
      addNewProductFucn();
    }
    //If image file not undefined
    else {
      await GetBucket();
      await addNewProductFucn();
    }
  }
  catch (err) {
    res.status(500).send({
      success:false,
      msg:"เกิดข้อผิดพลาดบางอย่างกรุณาองใหม่อีกครั้งค่ะ!"
    })
    console.log("Err", err);
  }
});
module.exports = app;