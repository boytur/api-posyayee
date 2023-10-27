const product = require('../schema/add_product_schema');
const dailySales = require('../schema/daily_sales_shema');

exports.con_sale = async (req, res) => {
  const _id = req.query._id; // รับ _id จากพารามิเตอร์
  const quantity = req.query.quantity; // รับปริมาณจากพารามิเตอร์

  try {
    // ค้นหาราคาของสินค้าจาก _id
    const productData = await product.findById(_id);

    if (!productData) {
      return res.status(404).json({ error: 'สินค้าไม่พบ' });
    }

    // คำนวณยอดขายจากราคาของสินค้าและปริมาณ
    const salesAmount = productData.price * quantity;

    // ดึงวันที่ปัจจุบัน
    const currentDate = new Date();
    // สกัดเฉพาะข้อมูลวันที่ในรูปแบบ ISODate
    const dateOnly = currentDate.toISOString().split('T')[0];

    // ค้นหายอดขายในวันที่นี้
    const existingDailySale = await dailySales.findOne({ date: dateOnly });

    if (existingDailySale) {
      // ถ้ามียอดขายในวันเดียวกัน ให้บวกเข้ายอดขายเดิม
      existingDailySale.salesAmount += salesAmount;
      await existingDailySale.save();
    } else {
      // ไม่มียอดขายในวันเดียวกัน สร้างและบันทึกข้อมูลยอดขายในแต่ละวันใหม่
      const newDailySale = new dailySales({
        date: dateOnly, // เปลี่ยนรูปแบบวันที่เป็น ISODate
        salesAmount: salesAmount, // ยอดขายในวันนี้
      });
      await newDailySale.save();
    }

    // ลดปริมาณของสินค้าตามปริมาณที่ระบุ
    await product.findByIdAndUpdate(_id, {
      $inc: { volume: -quantity },
      $currentDate: { lastUpdated: true },
    });

    console.log('ตอบกลับจากเส้นทางการขาย');
    res.status(200).json({ message: 'การขายเสร็จสมบูรณ์' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'ข้อผิดพลาดบนเซิร์ฟเวอร์' });
  }
};
