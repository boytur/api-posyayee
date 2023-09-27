/*
 เมื่อมี req มาจาก routes view-product-no-qr
 เพื่อดูสินค้าที่ไม่มีบาร์โค้ด   
 
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
 */
const AddProductNoQr = require("../schema/add_product_no_qr_schema");
exports.view_product_no_qr = async (req, res) => {
  try {
    // Query the database to retrieve products without a barcode
    const productsWithoutQR = await AddProductNoQr.find({});

    // Return the list of products as a JSON response
    res.json({ products: productsWithoutQR });
  } catch (error) {
    console.error("Error fetching products without QR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
