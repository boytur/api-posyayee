/*
 เมื่อมี req มาจาก routes add-products-no-qr 
 ให้เพิ่มข้อมูลลงใน database ผ่านโครงสร้าง schema
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
*/

//Model add_product_no_qr_schema
const AddProduct = require("../schema/add_product_schema");
const db = require('../db/db');
exports.add_product = async (req, res) => {
  const { name, image, price, volume ,barcode} = req.body;
  //validate ข้อมูลก่อนส่ง database
  switch (true) {
    case !name:
      return res.status(400).json({
        error: "Please input name",
      });
      break;
    case !price:
      return res.status(400).json({
        error: "Please input price",
      });
      break;
      // Create a new instance of the model with data
      const newProduct = new AddProduct({
        name: name,
        image: image,
        price: price,
        volume: volume,
      });
  }
  //บันทึกข้อมูล
  try {
    //เอาโมเดลไปยัดใน schema ที่ export มาในชื่อ AddProduct();
    const newProduct = new AddProduct({
      name: name,
      image: image,
      price: price,
      volume: volume,
      barcode:barcode
    });
    //หาว่ามีชื่อซํ้าไหม
    const existingProduct = await AddProduct.findOne({ name: name });
    //หาว่า barcode ซํ้าไหม 
    if (existingProduct) {
      return res.status(400).json({
        error: "Product with the same [name] already exists [NAME]",
      });
    }
    //ถ้า ป้อนบาร์โค้ดมา (ไม่เป็น undefined) ให้ไปหาบาร์โค้ดใน database
    else if (barcode!==undefined){
      const existingBarcodeProduct = await AddProduct.findOne({ barcode: barcode});
      if (existingBarcodeProduct) {
        return res.status(400).json({
          error: "Product with the same [barcode] already exists",
        });
      }
    }
    else {
      // validate เสร็จเซฟลง database 
      const savedProduct = await newProduct.save();
      console.log("Product added successfully:", savedProduct);
      res.json({ message: "Product added successfully", product: savedProduct });
    }
    
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
