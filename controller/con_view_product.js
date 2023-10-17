/*
 เมื่อมี req มาจาก routes view-product-no-qr
 เพื่อดูสินค้าที่ไม่มีบาร์โค้ด   
 
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */
const AddProduct = require("../schema/add_product_schema");
exports.view_product = async (req, res) => {
  try {
    // Query the database to retrieve products without a barcode
    const productsWithoutQR = await AddProduct.find({});

    // Return the list of products as a JSON response
    res.json({ products: productsWithoutQR });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดที่เซิร์ฟเวอร์", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};
