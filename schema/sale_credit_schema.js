const mongoose = require('mongoose');

const saleCreditSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  salesAmount: {
    type: Number,
    required: true,
  },
});

const CreaditSale = mongoose.model('CreditSale', saleCreditSchema);
module.exports = CreaditSale;
