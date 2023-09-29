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

exports.delete_product = async (req, res) => {
    const {_id} = req.body;
    if (!_id){
        res.status(400).json({"message": "Invalid Product"})
    }
  try {
    // ลบข้อมูลใน MongoDB โดยใช้ _id
    const result = await DeleteProduct.deleteOne({ _id: _id });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Products deleted' });
    } else {
      res.status(404).json({ message: `Not found product _id : ${_id}` });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};
