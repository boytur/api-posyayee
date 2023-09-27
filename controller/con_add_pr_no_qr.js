/*
 เมื่อมี req มาจาก routes add-products-no-qr 
 ให้เพิ่มข้อมูลลงใน database ผ่านโครงสร้าง schema
  DATE : 27/กันยายน/2023
  OWNER : piyawat W. 
*/

//Model add_product_no_qr_schema
const AddProductNoQr = require("../schema/add_product_no_qr_schema");

exports.add_product_no_qr = async (req, res) => {
  const { name, image, price, volume } = req.body;
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
    case !volume:
      return res.status(400).json({
        error: "Please input volume",
      });
      break;
      // Create a new instance of the model with data
      const newProduct = new AddProductNoQr({
        name: name,
        image: image,
        price: price,
        volume: volume,
      });
  }
  //บันทึกข้อมูล
  try {
    //หาว่ามีชื่อซํ้าไหม
    const existingProduct = await AddProductNoQr.findOne({ name: name });

    if (existingProduct) {
      return res.status(400).json({
        error: "Product with the same name already exists",
      });
    }

    // Create a new instance of the model with data
    const newProduct = new AddProductNoQr({
      name: name,
      image: image,
      price: price,
      volume: volume,
    });

    // Save the new document to the "products_no_qr" collection
    const savedProduct = await newProduct.save();

    console.log("Product added successfully:", savedProduct);
    res.json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
