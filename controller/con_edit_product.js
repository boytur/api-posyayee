/*
 เมื่อมี req มาจาก routes edit-products
 ให้แก้ไขข้อมูลลงใน database ผ่านโครงสร้าง schema
  DATE : 28/กันยายน/2023
  OWNER : piyawat W. 
*/

/*เพื่อแปลง _id ที่รับมาเป็น String จาก user ให้เป็น Objet เพราะ MongoDB
    ซัพพอร์ตแค่ Object
*/

const { ObjectId } = require('mongodb');
const EditProduct = require("../schema/add_product_schema");

exports.edit_product = async (req, res) => {
  const { _id, name, image, price, volume } = req.body;

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
          image: image,
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