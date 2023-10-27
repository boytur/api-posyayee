const daily_shema = require("../schema/daily_sales_shema");
const { format, subDays } = require("date-fns");

exports.con_dailysale = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    // สร้างออบเจ็กต์เพื่อเก็บข้อมูลยอดขายในแต่ละวัน
    const salesDataLast7Days = {};
    let totalSalesLast7Days = 0;
    for (let i = 0; i < 7; i++) {
      // จัดรูปวันที่ให้อยู่ในรูปแบบของฐานข้อมูล
      const formattedDateForDB = format(subDays(currentDate, i), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

      // ดึงข้อมูลจาก MongoDB สำหรับวันนั้น
      const saledaily = await daily_shema.find({ date: formattedDateForDB });

      // หายอดขายสำหรับวันนั้น ถ้ามีข้อมูล
      const salesAmount = saledaily[0] ? saledaily[0].salesAmount : 0;

      // สร้าง key ในออบเจ็กต์ที่เก็บข้อมูลโดยใช้รูปแบบ "dayX"
      const dayKey = `day${i + 1}`;
      totalSalesLast7Days+=salesAmount;
      // เพิ่มยอดขายลงในออบเจ็กต์
      salesDataLast7Days[dayKey] = salesAmount;
    }

    // สร้างตัวแปรเพื่อเก็บยอดขายรวม 30 วัน
    let totalSalesLast30Days = 0;

    for (let i = 0; i < 30; i++) {
      const formattedDateForDB = format(subDays(currentDate, i), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
      const saleDay = await daily_shema.find({ date: formattedDateForDB });
      const salesAmount = saleDay[0] ? saleDay[0].salesAmount : 0;

      // เพิ่มยอดขายในช่วง 30 วันที่ผ่านมา
      totalSalesLast30Days += salesAmount;
    }

    // เพิ่มยอดขายรวม 7,30 วันในออบเจ็กต์
    salesDataLast7Days.totalSalesLast30Days = totalSalesLast30Days;
    salesDataLast7Days.totalSalesLast7Days = totalSalesLast7Days;
    // ส่งออบเจ็กต์ที่มีข้อมูลยอดขายในแต่ละวันและยอดขายรวม 30 วันกลับให้แอพพลิเคชัน
    res.json(salesDataLast7Days);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดที่เซิร์ฟเวอร์", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};