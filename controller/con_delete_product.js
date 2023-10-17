/*
 เมื่อมี req มาจาก routes delte-products
 ให้ลบข้อมูลใน database ผ่านโครงสร้าง schema 
 และอ้างอิงจาก _id 

 NOTE : _id ที่รับเข้ามาไม่จำเป็นต้องแปลงเป็น obj 
 เพราะ BSON จะ error

  DATE : 29/กันยายน/2023
  OWNER : piyawat W. 
*/

const DeleteProduct = require("../schema/add_product_schema");
// delete_product
exports.delete_product = async (req, res) => {
  const _id = req.params._id; // รับ _id จาก params
  console.log(_id);
  if (!_id) {
    res.status(400).json({ message: "ไม่มีสินค้านี้อยู่" });
    console.log("Not found");
  }
  try {
    // ลบข้อมูลใน MongoDB โดยใช้ _id
    const result = await DeleteProduct.deleteOne({ _id: _id });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'สินค้าถูกลบแล้ว' });
    } else {
      return res.status(404).json({ message: `ไม่เจอสินค้าไอดีนี้ : ${_id}` });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
  }
};