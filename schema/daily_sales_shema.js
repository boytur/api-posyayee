const mongoose = require('mongoose');

const dailySalesSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // ให้ date เป็นข้อมูลที่ไม่ซ้ำกัน
  },
  salesAmount: {
    type: Number,
    required: true,
  },
});

const DailySales = mongoose.model('DailySales', dailySalesSchema);

module.exports = DailySales;
