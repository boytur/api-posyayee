const productShema = require('../schema/product_schema');

exports.add_product_quantity = async (req, res) => {
    try {
        const { products } = req.body;
        for (const product of products) {
            //console.table([product.name, product._id, product.quantity, product.price]);

            switch (true) {
                case !product._id:
                    return res.status(400).json({ message: "กรุณาระบุไอดีสินค้า" });
                    break;
                case !product.quantity:
                    return res.status(400).json({ message: "กรุณาระบุจำนวนสินค้า" });
                    break;
            }
            const existingProduct = await productShema.findOne({ _id: product._id });
            if (existingProduct) {
                const updateProduct = await productShema.updateOne(
                    { _id: product._id },
                    {
                        $inc: { volume: +product.quantity },
                        $currentDate: { lastUpdated: false },
                    }
                );
                console.log(updateProduct);
            }
            else if (!existingProduct) {
                console.log("ไม่มีสินค้านี้");
                res.status(404).json({ message: "ไม่มีสินค้านี้"});
                break;
            }
        }
    res.status(200).json({ message: "บันทึกข้อมูลเรียบร้อย" });    
    } catch (err) {
        if (err){
            console.error(err);
            return res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
        }
    }
};
