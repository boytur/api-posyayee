/*
 เมื่อมี req มาจาก routes add-products
 ให้เพิ่มข้อมูลลงใน database ผ่านโครงสร้าง schema
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
*/

//Model add_product_schema
const AddProduct = require("../schema/add_product_schema");
exports.add_product = async (req, res) => {
  const { name, image, price, volume, barcode } = req.body;
  //validate ข้อมูลก่อนส่ง database
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
  //บันทึกข้อมูล
  try {
    //เอาโมเดลไปยัดใน schema ที่ export มาในชื่อ AddProduct();
    const newProduct = new AddProduct({
      name: name,
      image: image,
      price: price,
      volume: volume,
      barcode: barcode,
    });
    //หาว่ามีชื่อซํ้าไหม
    const existingProduct = await AddProduct.findOne({ name: name });
    //หาว่า barcode ซํ้าไหม
    if (existingProduct) {
      return res.status(400).json({
        error: "สินชื่อค้านี้มีอยู่แล้ว",
      });
    }
    //ถ้า ป้อนบาร์โค้ดมา (ไม่เป็น undefined) ให้ไปหาบาร์โค้ดใน database
    if (barcode !== undefined && barcode.length !== 13 && barcode != '') {
      // ดำเนินการเฉพาะเมื่อ barcode ไม่เป็น undefined และความยาวไม่เท่ากับ 13
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
      volume = -1;
      return res.status(400).json({
        error: "กรุณาใส่จำนวนที่ถูกต้อง",
      });
    }
    // validate เสร็จเซฟลง database
    const savedProduct = await newProduct.save();
    res.json({ message: `${name} ถูกเพิ่มแล้ว`, product: savedProduct });
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์กรุณาลองใหม่อีกครั้ง" });
  }
};