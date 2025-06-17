const mongoose = require('mongoose');

const paymentReceiptSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amountPaid: { type: Number, required: true },
  modeOfPayment: { type: String, enum: ['M-Pesa', 'Bank Transfer', 'Credit Card', 'Cash'], required: true },
  transactionReference: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  deductions: { type: Number, default: 0 },
  remainingBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PaymentReceipt', paymentReceiptSchema);