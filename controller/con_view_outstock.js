/*
 เมื่อมี req มาจาก routes view-outstock-product
 เพื่อดูสินค้าที่ใกล้หมด (น้อยกว่า5ชิ้น)
 
  DATE : 28/กันยายน/2023
  OWNER : piyawat W. 
*/

const product_structure = require("../schema/add_product_schema");

exports.view_outstock_product = async (req, res) => {
  try {
    // Query the database to retrieve products without a barcode
    const products = await product_structure.find({});

    // Filter products with volume greater than or equal to 0 and less than 5
    const filteredProducts = products.filter((product) => {
      return product.volume !== -1 && product.volume < 5;
    });

    // Return the filtered list of products as a JSON response
    res.json({ products: filteredProducts });
  } catch (error) {
    console.error("Error fetching products ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
