/*
 เมื่อมี req มาจาก routes delte-products
 ให้ลบข้อมูลใน database ผ่านโครงสร้าง schema 
 และอ้างอิงจาก _id 

 NOTE : _id ที่รับเข้ามาไม่จำเป็นต้องแปลงเป็น obj 
 เพราะ BSON จะ error

  DATE : 29/กันยายน/2023
  OWNER : piyawat W. 
*/

const deleteFileB2 = require("../middleware/deleteB2");
const product_schema = require("../schema/product_schema");
const DeleteProduct = require("../schema/product_schema");

// delete_product
exports.delete_product = async (req, res) => {
  const _id = req.params._id; // รับ _id จาก params
  const product = await product_schema.findOne({
    _id: _id
  })

  const productImage = product.image
  if (!_id) {
    res.status(400).json({ message: "ไม่มีสินค้านี้อยู่ค่ะ" });
    console.log("Not found");
  }
  try {
    // ลบข้อมูลใน MongoDB โดยใช้ _id
    const result = await DeleteProduct.deleteOne({ _id: _id });
    const filename = productImage.replace("https://f005.backblazeb2.com/file/posyayee/", "");

    if (result.deletedCount === 1) {
      deleteFileB2(filename);
      return res.status(200).json({ message: 'สินค้าถูกลบแล้วค่ะ' });
    } else {
      return res.status(404).json({ message: `ไม่เจอสินค้าไอดีนี้ค่ะ : ${_id}` });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
  }
};