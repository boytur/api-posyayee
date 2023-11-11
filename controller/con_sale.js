const Product = require('../schema/add_product_schema');
const DailySale = require('../schema/daily_sales_shema');

exports.con_sale = async (req, res) => {
  try {
    const { products } = req.body;

    const currentDate = new Date();
    const dateOnly = currentDate.toISOString().split('T')[0];

    let totalPrice = 0;
    let productUpdatePromises = [];

    for (const product of products) {
      const result = await Product.findOne({ _id: product._id });

      if (!result) {
        return res.status(400).json({ message: 'ไม่พบสินค้า' });
      }
      const productPrice = result.price * product.quantity;
      totalPrice += productPrice;

      if (result.volume !== null) {
        productUpdatePromises.push(
          Product.updateOne(
            { _id: product._id },
            {
              $inc: { volume: -product.quantity },
              $currentDate: { lastUpdated: false },
            }
          )
        );
      }

      const existingDailySale = await DailySale.findOne({ date: dateOnly });

      if (existingDailySale) {
        existingDailySale.salesAmount += productPrice;
        await existingDailySale.save();
      } else {
        const newDailySale = new DailySale({
          date: dateOnly,
          salesAmount: productPrice,
        });
        await newDailySale.save();
      }
    }

    await Promise.all(productUpdatePromises);

    res.status(200).json({ message: 'การขายเสร็จสมบูรณ์' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ข้อผิดพลาดบนเซิร์ฟเวอร์' });
  }
};
